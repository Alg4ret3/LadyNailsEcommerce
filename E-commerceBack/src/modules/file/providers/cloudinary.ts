import { 
  ModuleProvider, 
  Modules 
} from "@medusajs/framework/utils"
import { v2 as cloudinary } from "cloudinary"
import "multer"



type InjectedDependencies = {}

type Options = {
  cloud_name: string
  api_key: string
  api_secret: string
}

class CloudinaryFileProvider {
  static identifier = "cloudinary"


  protected options_: Options

  constructor(_: InjectedDependencies, options: Options) {
    this.options_ = options

    cloudinary.config({
      cloud_name: options.cloud_name,
      api_key: options.api_key,
      api_secret: options.api_secret,
    })
  }

  async upload(file: any): Promise<{ url: string; key: string }> {
    console.log("DEBUG: Uploading file to Cloudinary", {
      filename: file.filename,
      mimeType: file.mimeType,
      contentType: typeof file.content,
      contentLength: file.content?.length,
      isBuffer: Buffer.isBuffer(file.content)
    })

    return new Promise((resolve, reject) => {
      const isRaw = file.filename?.match(/\.(csv|txt|pdf|zip|xlsx|json)$/i) || file.mimeType?.includes('csv') || file.mimeType?.includes('json');
      
      const cleanFilename = file.filename?.replace(/^ladynails-products\//, "") || "";
      const uploadOptions: any = {
        folder: "ladynails-products",
        resource_type: isRaw ? "raw" : "auto",
        public_id: cleanFilename,
      };

      if (!isRaw) {
        uploadOptions.fetch_format = "auto";
        uploadOptions.quality = "auto";
        uploadOptions.flags = "lossy";
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            return reject(error)
          }
          if (!result) {
            return reject(new Error("Cloudinary upload failed"))
          }
          console.log("DEBUG: Cloudinary upload success", result.secure_url)
          resolve({ 
            url: result.secure_url,
            key: result.public_id
          })
        }
      )
      
      const content = file.content || file.buffer
      if (!content) {
        return reject(new Error("No file content or buffer found"))
      }

      let buffer: Buffer;
      if (typeof content === 'string') {
        const isDataUri = content.match(/^data:.*?;base64,/);
        if (isDataUri) {
          buffer = Buffer.from(content.replace(/^data:.*?;base64,/, ""), 'base64');
        } else {
          const decoded = Buffer.from(content, "base64");
          if (decoded.toString("base64") === content) {
            buffer = decoded;
          } else {
            buffer = Buffer.from(content, "utf8");
          }
        }
      } else {
        buffer = content;
      }

      uploadStream.end(buffer)
    })
  }

  async delete(files: any): Promise<void> {
    const fileArray = Array.isArray(files) ? files : [files]
    for (const file of fileArray) {
      const fileKey = file.fileKey || file.file_key || file.key
      if (fileKey) {
        await cloudinary.uploader.destroy(fileKey)
      }
    }
  }

  async getPresignedDownloadUrl(fileData: any): Promise<string> {
    // fileData can be a plain string (from import workflow) or an object
    if (typeof fileData === "string") {
      const isRaw = fileData.match(/\.(csv|txt|pdf|zip|xlsx|json)$/i);
      const resourceType = isRaw ? "raw" : "image";
      const url = `https://res.cloudinary.com/${this.options_.cloud_name}/${resourceType}/upload/${fileData}`;
      console.log("DEBUG: getPresignedDownloadUrl (string)", url);
      return url;
    }

    if (fileData.url) return fileData.url;

    const fileKey = fileData.fileKey || fileData.file_key || fileData.key || "";
    // CSV exports and other non-image files are uploaded as 'raw' resource type in Cloudinary
    const isRaw = fileKey.match(/\.(csv|txt|pdf|zip|xlsx|json)$/i);
    const resourceType = isRaw ? "raw" : "image";
    const url = `https://res.cloudinary.com/${this.options_.cloud_name}/${resourceType}/upload/${fileKey}`;
    console.log("DEBUG: getPresignedDownloadUrl (object)", url);
    return url;
  }

  async getUploadStream(fileData: any): Promise<{
    writeStream: import("stream").Writable;
    promise: Promise<any>;
    url: string;
    fileKey: string;
  }> {
    const fileKey = fileData.filename;
    const isImage = fileData.mimeType?.startsWith("image/");
    
    let resolvePromise: any;
    let rejectPromise: any;

    const promise = new Promise<{ url: string; key: string }>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    const writeStream = cloudinary.uploader.upload_stream(
      { 
        folder: "ladynails-products",
        resource_type: isImage ? "image" : "raw",
        public_id: fileKey
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload stream error:", error);
          return rejectPromise(error);
        }
        if (!result) {
          return rejectPromise(new Error("Cloudinary upload stream failed"));
        }
        console.log("DEBUG: Cloudinary stream upload success", result.secure_url);
        resolvePromise({ 
          url: result.secure_url,
          key: result.public_id
        });
      }
    );

    return {
      writeStream,
      promise,
      url: `https://res.cloudinary.com/${this.options_.cloud_name}/${isImage ? "image" : "raw"}/upload/v1/ladynails-products/${fileKey}`,
      fileKey: `ladynails-products/${fileKey}`
    };
  }

  async getPresignedUploadUrl(fileData: any): Promise<{ url: string, key: string }> {
    if (!fileData?.filename) {
      throw new Error("No filename provided");
    }
    
    // In Medusa v2, returning /admin/uploads instructs the admin UI 
    // to use the default backend upload endpoint, which will then use the upload() method.
    return {
      url: "/admin/uploads",
      key: fileData.filename,
    };
  }

  async getDownloadStream(fileData: any): Promise<import("stream").Readable> {
    const url = await this.getPresignedDownloadUrl(fileData);
    console.log("DEBUG: getDownloadStream fetching", url);

    const fetchWithRedirects = (targetUrl: string, maxRedirects = 5): Promise<import("stream").Readable> => {
      return new Promise((resolve, reject) => {
        const protocol = targetUrl.startsWith("https") ? require("https") : require("http");
        protocol.get(targetUrl, (res: any) => {
          console.log("DEBUG: getDownloadStream status", res.statusCode, "content-type", res.headers["content-type"]);
          // Follow redirects (3xx)
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            if (maxRedirects <= 0) {
              return reject(new Error("Too many redirects"));
            }
            res.resume(); // drain the response
            return resolve(fetchWithRedirects(res.headers.location, maxRedirects - 1));
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`Failed to download file from Cloudinary. Status: ${res.statusCode}, URL: ${targetUrl}`));
          }
          // Strip UTF-8 BOM if present so csv-parse gets clean headers
          const { Transform } = require("stream");
          let bomStripped = false;
          const bomStripper = new Transform({
            transform(chunk: Buffer, _encoding: string, callback: Function) {
              if (!bomStripped) {
                bomStripped = true;
                // UTF-8 BOM: EF BB BF
                if (chunk[0] === 0xEF && chunk[1] === 0xBB && chunk[2] === 0xBF) {
                  console.log("DEBUG: Stripping UTF-8 BOM from CSV stream");
                  chunk = chunk.slice(3);
                }
              }
              callback(null, chunk);
            }
          });
          resolve(res.pipe(bomStripper));
        }).on('error', reject);
      });
    };

    return fetchWithRedirects(url);
  }

  async getAsBuffer(fileData: any): Promise<Buffer> {
    const stream = await this.getDownloadStream(fileData);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}

export default ModuleProvider(Modules.FILE, {
  services: [CloudinaryFileProvider],
})
