import("scrypt-kdf").then(m => {
    console.log("Keys:", Object.keys(m));
    console.log("Has default:", "default" in m);
    if (m.default) console.log("Default keys:", Object.keys(m.default));
}).catch(err => console.error(err));
