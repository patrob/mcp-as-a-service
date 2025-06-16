import { mapValues } from '../runtime';
export interface WeatherForecast {
    date?: Date;
    temperatureC?: number;
    readonly temperatureF?: number;
    summary?: string | null;
}

/**
 * Check if a given object implements the WeatherForecast interface.
 */
export function instanceOfWeatherForecast(value: object): value is WeatherForecast {
    return true;
}

export function WeatherForecastFromJSON(json: any): WeatherForecast {
    return WeatherForecastFromJSONTyped(json, false);
}

export function WeatherForecastFromJSONTyped(json: any, ignoreDiscriminator: boolean): WeatherForecast {
    if (json == null) {
        return json;
    }
    return {
        
        'date': json['date'] == null ? undefined : (new Date(json['date'])),
        'temperatureC': json['temperatureC'] == null ? undefined : json['temperatureC'],
        'temperatureF': json['temperatureF'] == null ? undefined : json['temperatureF'],
        'summary': json['summary'] == null ? undefined : json['summary'],
    };
}

export function WeatherForecastToJSON(json: any): WeatherForecast {
    return WeatherForecastToJSONTyped(json, false);
}

export function WeatherForecastToJSONTyped(value?: Omit<WeatherForecast, 'temperatureF'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'date': value['date'] == null ? undefined : ((value['date']).toISOString().substring(0,10)),
        'temperatureC': value['temperatureC'],
        'summary': value['summary'],
    };
}

