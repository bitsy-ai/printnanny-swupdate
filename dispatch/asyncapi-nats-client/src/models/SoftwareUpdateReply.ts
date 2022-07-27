import SoftwareUpdateStatus from './SoftwareUpdateStatus';

class SoftwareUpdateReply {
  private _status: SoftwareUpdateStatus;
  private _detail: string;
  private _exitCode?: number;

  constructor(input: {
    status: SoftwareUpdateStatus,
    detail: string,
    exitCode?: number,
  }) {
    this._status = input.status;
    this._detail = input.detail;
    this._exitCode = input.exitCode;
  }

  get status(): SoftwareUpdateStatus { return this._status; }
  set status(status: SoftwareUpdateStatus) { this._status = status; }

  get detail(): string { return this._detail; }
  set detail(detail: string) { this._detail = detail; }

  get exitCode(): number | undefined { return this._exitCode; }
  set exitCode(exitCode: number | undefined) { this._exitCode = exitCode; }

  public marshal() : string {
    let json = '{'
    if(this.status !== undefined) {
      json += `"status": ${typeof this.status === 'number' || typeof this.status === 'boolean' ? this.status : JSON.stringify(this.status)},`; 
    }
    if(this.detail !== undefined) {
      json += `"detail": ${typeof this.detail === 'number' || typeof this.detail === 'boolean' ? this.detail : JSON.stringify(this.detail)},`; 
    }
    if(this.exitCode !== undefined) {
      json += `"exit_code": ${typeof this.exitCode === 'number' || typeof this.exitCode === 'boolean' ? this.exitCode : JSON.stringify(this.exitCode)},`; 
    }
  
  

    //Remove potential last comma 
    return `${json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}`;
  }

  public static unmarshal(json: string | object): SoftwareUpdateReply {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new SoftwareUpdateReply({} as any);

    if (obj["status"] !== undefined) {
      instance.status = obj["status"];
    }
    if (obj["detail"] !== undefined) {
      instance.detail = obj["detail"];
    }
    if (obj["exit_code"] !== undefined) {
      instance.exitCode = obj["exit_code"];
    }

    //Not part of core properties
  
  
    for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["status","detail","exit_code"].includes(key);}))) {
    
    
    }
    return instance;
  }
}
export default SoftwareUpdateReply;
