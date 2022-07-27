

class SoftwareUpdateRequest {
  private _displayName: string;
  private _version: string;
  private _checksumTxtUrl: string;
  private _checksumTxtGpgUrl: string;
  private _swuUrl: string;
  private _manifestUrl: string;
  private _imageWicUrl: string;
  private _imageWicBmapUrl: string;

  constructor(input: {
    displayName: string,
    version: string,
    checksumTxtUrl: string,
    checksumTxtGpgUrl: string,
    swuUrl: string,
    manifestUrl: string,
    imageWicUrl: string,
    imageWicBmapUrl: string,
  }) {
    this._displayName = input.displayName;
    this._version = input.version;
    this._checksumTxtUrl = input.checksumTxtUrl;
    this._checksumTxtGpgUrl = input.checksumTxtGpgUrl;
    this._swuUrl = input.swuUrl;
    this._manifestUrl = input.manifestUrl;
    this._imageWicUrl = input.imageWicUrl;
    this._imageWicBmapUrl = input.imageWicBmapUrl;
  }

  get displayName(): string { return this._displayName; }
  set displayName(displayName: string) { this._displayName = displayName; }

  get version(): string { return this._version; }
  set version(version: string) { this._version = version; }

  get checksumTxtUrl(): string { return this._checksumTxtUrl; }
  set checksumTxtUrl(checksumTxtUrl: string) { this._checksumTxtUrl = checksumTxtUrl; }

  get checksumTxtGpgUrl(): string { return this._checksumTxtGpgUrl; }
  set checksumTxtGpgUrl(checksumTxtGpgUrl: string) { this._checksumTxtGpgUrl = checksumTxtGpgUrl; }

  get swuUrl(): string { return this._swuUrl; }
  set swuUrl(swuUrl: string) { this._swuUrl = swuUrl; }

  get manifestUrl(): string { return this._manifestUrl; }
  set manifestUrl(manifestUrl: string) { this._manifestUrl = manifestUrl; }

  get imageWicUrl(): string { return this._imageWicUrl; }
  set imageWicUrl(imageWicUrl: string) { this._imageWicUrl = imageWicUrl; }

  get imageWicBmapUrl(): string { return this._imageWicBmapUrl; }
  set imageWicBmapUrl(imageWicBmapUrl: string) { this._imageWicBmapUrl = imageWicBmapUrl; }

  public marshal() : string {
    let json = '{'
    if(this.displayName !== undefined) {
      json += `"display_name": ${typeof this.displayName === 'number' || typeof this.displayName === 'boolean' ? this.displayName : JSON.stringify(this.displayName)},`; 
    }
    if(this.version !== undefined) {
      json += `"version": ${typeof this.version === 'number' || typeof this.version === 'boolean' ? this.version : JSON.stringify(this.version)},`; 
    }
    if(this.checksumTxtUrl !== undefined) {
      json += `"checksum_txt_url": ${typeof this.checksumTxtUrl === 'number' || typeof this.checksumTxtUrl === 'boolean' ? this.checksumTxtUrl : JSON.stringify(this.checksumTxtUrl)},`; 
    }
    if(this.checksumTxtGpgUrl !== undefined) {
      json += `"checksum_txt_gpg_url": ${typeof this.checksumTxtGpgUrl === 'number' || typeof this.checksumTxtGpgUrl === 'boolean' ? this.checksumTxtGpgUrl : JSON.stringify(this.checksumTxtGpgUrl)},`; 
    }
    if(this.swuUrl !== undefined) {
      json += `"swu_url": ${typeof this.swuUrl === 'number' || typeof this.swuUrl === 'boolean' ? this.swuUrl : JSON.stringify(this.swuUrl)},`; 
    }
    if(this.manifestUrl !== undefined) {
      json += `"manifest_url": ${typeof this.manifestUrl === 'number' || typeof this.manifestUrl === 'boolean' ? this.manifestUrl : JSON.stringify(this.manifestUrl)},`; 
    }
    if(this.imageWicUrl !== undefined) {
      json += `"image_wic_url": ${typeof this.imageWicUrl === 'number' || typeof this.imageWicUrl === 'boolean' ? this.imageWicUrl : JSON.stringify(this.imageWicUrl)},`; 
    }
    if(this.imageWicBmapUrl !== undefined) {
      json += `"image_wic_bmap_url": ${typeof this.imageWicBmapUrl === 'number' || typeof this.imageWicBmapUrl === 'boolean' ? this.imageWicBmapUrl : JSON.stringify(this.imageWicBmapUrl)},`; 
    }
  
  

    //Remove potential last comma 
    return `${json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}`;
  }

  public static unmarshal(json: string | object): SoftwareUpdateRequest {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new SoftwareUpdateRequest({} as any);

    if (obj["display_name"] !== undefined) {
      instance.displayName = obj["display_name"];
    }
    if (obj["version"] !== undefined) {
      instance.version = obj["version"];
    }
    if (obj["checksum_txt_url"] !== undefined) {
      instance.checksumTxtUrl = obj["checksum_txt_url"];
    }
    if (obj["checksum_txt_gpg_url"] !== undefined) {
      instance.checksumTxtGpgUrl = obj["checksum_txt_gpg_url"];
    }
    if (obj["swu_url"] !== undefined) {
      instance.swuUrl = obj["swu_url"];
    }
    if (obj["manifest_url"] !== undefined) {
      instance.manifestUrl = obj["manifest_url"];
    }
    if (obj["image_wic_url"] !== undefined) {
      instance.imageWicUrl = obj["image_wic_url"];
    }
    if (obj["image_wic_bmap_url"] !== undefined) {
      instance.imageWicBmapUrl = obj["image_wic_bmap_url"];
    }

    //Not part of core properties
  
  
    for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["display_name","version","checksum_txt_url","checksum_txt_gpg_url","swu_url","manifest_url","image_wic_url","image_wic_bmap_url"].includes(key);}))) {
    
    
    }
    return instance;
  }
}
export default SoftwareUpdateRequest;
