import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PartnerProfileStore } from '../partner-profile';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/throw';

import { KalturaClient } from '@kaltura-ng/kaltura-client';

import { FlavorParamsListAction } from 'kaltura-typescript-client/types/FlavorParamsListAction';
import { KalturaFlavorParams } from 'kaltura-typescript-client/types/KalturaFlavorParams';
import { KalturaFilterPager } from 'kaltura-typescript-client/types/KalturaFilterPager';
import { KalturaFlavorParamsListResponse } from 'kaltura-typescript-client/types/KalturaFlavorParamsListResponse';
import { KalturaDetachedResponseProfile } from 'kaltura-typescript-client/types/KalturaDetachedResponseProfile';
import { KalturaResponseProfileType } from 'kaltura-typescript-client/types/KalturaResponseProfileType';

@Injectable()
export class FlavoursStore extends PartnerProfileStore
{
    private _cachedProfiles : KalturaFlavorParams[] = [];

    constructor(private _kalturaServerClient: KalturaClient) {
    	super();
    }

    public get() : Observable<{items : KalturaFlavorParams[]}>
    {
        return Observable.create(observer =>
        {
	        let sub: ISubscription;
            const cachedResults = this._cachedProfiles;
            if (cachedResults.length)
            {
                observer.next({items : cachedResults});
                observer.complete();
            }else {
	            sub = this._buildGetRequest().subscribe(
                    response =>
                    {
	                    sub = null;
                        observer.next({items : response.objects});
                        observer.complete();
                    },
                    error =>
                    {
	                    sub = null;
                        observer.error(error);
                    }
                );
            }
	        return () =>{
		        if (sub) {
			        sub.unsubscribe();
		        }
	        }
        });

    }

    private _buildGetRequest(): Observable<KalturaFlavorParamsListResponse> {

	    const responseProfile: KalturaDetachedResponseProfile = new KalturaDetachedResponseProfile(
            {
                fields : "id,name",
                type : KalturaResponseProfileType.includeFields
            }
        );

	    const favourParamsPager = new KalturaFilterPager();
	    favourParamsPager.pageSize = 500;

        return <any>this._kalturaServerClient.request(new FlavorParamsListAction({pager: favourParamsPager, responseProfile}));
    }
}
