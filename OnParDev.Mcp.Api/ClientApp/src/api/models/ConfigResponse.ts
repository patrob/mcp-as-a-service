import { mapValues } from '../runtime';

export interface ConfigResponse {
    googleClientId?: string | null;
}

/** Check if a given object implements the ConfigResponse interface. */
export function instanceOfConfigResponse(value: object): value is ConfigResponse {
    return true;
}

export function ConfigResponseFromJSON(json: any): ConfigResponse {
    return ConfigResponseFromJSONTyped(json, false);
}

export function ConfigResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfigResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'googleClientId': json['googleClientId'] == null ? undefined : json['googleClientId'],
    };
}

export function ConfigResponseToJSON(json: any): ConfigResponse {
    return ConfigResponseToJSONTyped(json, false);
}

export function ConfigResponseToJSONTyped(value?: ConfigResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'googleClientId': value['googleClientId'],
    };
}

