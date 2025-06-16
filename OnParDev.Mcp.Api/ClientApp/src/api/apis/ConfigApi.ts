import * as runtime from '../runtime';
import type { ConfigResponse } from '../models/index';
import {
    ConfigResponseFromJSON,
    ConfigResponseToJSON,
} from '../models/index';

export class ConfigApi extends runtime.BaseAPI {

    async getConfigRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/config`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigResponseFromJSON(jsonValue));
    }

    async getConfig(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigResponse> {
        const response = await this.getConfigRaw(initOverrides);
        return await response.value();
    }

}
