import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { ConversionProfileListAction } from 'kaltura-typescript-client/types/ConversionProfileListAction';
import { KalturaConversionProfileFilter } from 'kaltura-typescript-client/types/KalturaConversionProfileFilter';
import { KalturaConversionProfileType } from 'kaltura-typescript-client/types/KalturaConversionProfileType';
import { KalturaFilterPager } from 'kaltura-typescript-client/types/KalturaFilterPager';
import { KalturaConversionProfileListResponse } from 'kaltura-typescript-client/types/KalturaConversionProfileListResponse';
import { KalturaConversionProfile } from 'kaltura-typescript-client/types/KalturaConversionProfile';

@Injectable()
export class TranscodingProfileManagement {
  private _transcodingProfileCache$;

  constructor(private _serverClient: KalturaClient) {

  }

  private _loadTranscodingProfiles(): Observable<KalturaConversionProfile[]> {
    const payload = new ConversionProfileListAction({
      filter: new KalturaConversionProfileFilter({ typeEqual: KalturaConversionProfileType.media }),
      pager: new KalturaFilterPager({ pageSize: 500 })
    });

    return this._serverClient
      .request(new ConversionProfileListAction(payload))
      .map((res: KalturaConversionProfileListResponse) => res.objects);
  }

  public get(): Observable<KalturaConversionProfile[]> {
    if (!this._transcodingProfileCache$) {
      this._transcodingProfileCache$ = this._loadTranscodingProfiles()
        .catch(err => {
          console.log(`log: [warn] [transcodingProfile-management] Error during load transcoding profiles: ${err}`);
          this._transcodingProfileCache$ = null;
          return Observable.throw(err);
        })
        .publishReplay(1)
        .refCount();
    }

    return this._transcodingProfileCache$;
  }

  public clearCache(): void {
    this._transcodingProfileCache$ = null;
  }

}