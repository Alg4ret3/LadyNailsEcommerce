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
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "ladynails-products",
          resource_type: "auto",
          fetch_format: "auto",
          quality: "auto",
          flags: "lossy"
        },
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

      // In Medusa v2, file.content is usually a base64 string if it's not a Buffer
      const buffer = typeof content === 'string' 
        ? Buffer.from(content.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64') 
        : content

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
    if (fileData.url) return fileData.url;
    
    const fileKey = fileData.fileKey || fileData.file_key || fileData.key || "";
    // CSV exports and other non-image files are uploaded as 'raw' resource type in Cloudinary
    const isRaw = fileKey.match(/\.(csv|txt|pdf|zip|xlsx)$/i);
    const resourceType = isRaw ? "raw" : "image";
    
    return `https://res.cloudinary.com/${this.options_.cloud_name}/${resourceType}/upload/${fileKey}`;
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

  async getDownloadStream(fileData: any): Promise<import("stream").Readable> {
    throw new Error("getDownloadStream not implemented for Cloudinary provider");
  }

  async getAsBuffer(fileData: any): Promise<Buffer> {
    throw new Error("getAsBuffer not implemented for Cloudinary provider");
  }
}

export default ModuleProvider(Modules.FILE, {
  services: [CloudinaryFileProvider],
})
