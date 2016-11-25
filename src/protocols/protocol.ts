export interface Protocol {
  version: number,
  typeInfos: Array<any>;
  gameEventTypes: { [key: number]: Array<any> };
  gameEventIdTypeId: number;
  messageEventTypes: { [key: number]: Array<any> };
  trackerEventTypes: { [Key: number]: Array<any> };
  trackerEventIdTypeId: number;
  svaruint32TypeId: number;
  replayUserIdTypeId: number;
  gameDetailsTypeId: number;
  replayInitdataTypeId: number;

  varuint32Value(value: any): number;
  decodeReplayHeader(contents: any): any;
  decodeReplayDetails(contents: any): any;
  decodeReplayInitData(contents: any): any;
  decodeReplayAttributesEvents(contents: any): any;
  decodeReplayMessageEvents(contents: any): any;
  decodeReplayTrackerEvents(contents: any): any;
  decodeReplayGameEvents(contents: any): any;  
  unitTag(tagIndex: number, tagRecycle: number): number;
  unitTagIndex(tag: number): number;
  unitTagRecycle(tag: number): number;
}