import * as runtime from '../runtime';
import type { WeatherForecast } from '../models/index';
import {
    WeatherForecastFromJSON,
    WeatherForecastToJSON,
} from '../models/index';

export class WeatherForecastApi extends runtime.BaseAPI {

    async weatherForecastGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<WeatherForecast>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/WeatherForecast`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(WeatherForecastFromJSON));
    }

    async weatherForecastGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<WeatherForecast>> {
        const response = await this.weatherForecastGetRaw(initOverrides);
        return await response.value();
    }

}
