/**
 * cloud.dalane.api.accounts
 * v1-alpha
 * DO NOT MODIFY - This file has been generated using oazapfts.
 * See https://www.npmjs.com/package/oazapfts
 */
export const defaults: RequestOpts = {
    baseUrl: "http://localhost:8001/v1",
};
export const servers = {
    live: "http://accounts.api.dalane.cloud/v1"
};
type Encoders = Array<(s: string) => string>;
export type RequestOpts = {
    baseUrl?: string;
    fetch?: typeof fetch;
    headers?: Record<string, string | undefined>;
} & Omit<RequestInit, "body" | "headers">;
type FetchRequestOpts = RequestOpts & {
    body?: string | FormData;
};
type JsonRequestOpts = RequestOpts & {
    body: object;
};
type MultipartRequestOpts = RequestOpts & {
    body: Record<string, string | Blob | undefined | any>;
};
export const _ = {
    async fetch(url: string, req?: FetchRequestOpts) {
        const { baseUrl, headers, fetch: customFetch, ...init } = {
            ...defaults,
            ...req,
        };
        const href = _.joinUrl(baseUrl, url);
        const res = await (customFetch || fetch)(href, {
            ...init,
            headers: _.stripUndefined({ ...defaults.headers, ...headers }),
        });
        let text;
        try {
            text = await res.text();
        }
        catch (err) { }
        if (!res.ok) {
            throw new HttpError(res.status, res.statusText, href, text);
        }
        return text;
    },
    async fetchJson(url: string, req: FetchRequestOpts = {}) {
        const res = await _.fetch(url, {
            ...req,
            headers: {
                ...req.headers,
                Accept: "application/json",
            },
        });
        return res && JSON.parse(res);
    },
    json({ body, headers, ...req }: JsonRequestOpts) {
        return {
            ...req,
            body: JSON.stringify(body),
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
        };
    },
    form({ body, headers, ...req }: JsonRequestOpts) {
        return {
            ...req,
            body: QS.form(body),
            headers: {
                ...headers,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
    },
    multipart({ body, ...req }: MultipartRequestOpts) {
        const data = new FormData();
        Object.entries(body).forEach(([name, value]) => {
            data.append(name, value);
        });
        return {
            ...req,
            body: data,
        };
    },
    /**
     * Deeply remove all properties with undefined values.
     */
    stripUndefined<T>(obj: T) {
        return obj && JSON.parse(JSON.stringify(obj));
    },
    // Encode param names and values as URIComponent
    encodeReserved: [encodeURIComponent, encodeURIComponent],
    allowReserved: [encodeURIComponent, encodeURI],
    /**
     * Creates a tag-function to encode template strings with the given encoders.
     */
    encode(encoders: Encoders, delimiter = ",") {
        const q = (v: any, i: number) => {
            const encoder = encoders[i % encoders.length];
            if (typeof v === "object") {
                if (Array.isArray(v)) {
                    return v.map(encoder).join(delimiter);
                }
                const flat = Object.entries(v).reduce((flat, entry) => [...flat, ...entry], [] as any);
                return flat.map(encoder).join(delimiter);
            }
            return encoder(String(v));
        };
        return (strings: TemplateStringsArray, ...values: any[]) => {
            return strings.reduce((prev, s, i) => {
                return `${prev}${s}${q(values[i] || "", i)}`;
            }, "");
        };
    },
    /**
     * Separate array values by the given delimiter.
     */
    delimited(delimiter = ",") {
        return (params: Record<string, any>, encoders = _.encodeReserved) => Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .map(([name, value]) => _.encode(encoders, delimiter) `${name}=${value}`)
            .join("&");
    },
    joinUrl(...parts: Array<string | undefined>) {
        return parts
            .filter(Boolean)
            .join("/")
            .replace(/([^:]\/)\/+/, "$1");
    },
};
/**
 * Functions to serialize query parameters in different styles.
 */
export const QS = {
    /**
     * Join params using an ampersand and prepends a questionmark if not empty.
     */
    query(...params: string[]) {
        const s = params.join("&");
        return s && `?${s}`;
    },
    /**
     * Serializes nested objects according to the `deepObject` style specified in
     * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#style-values
     */
    deep(params: Record<string, any>, [k, v] = _.encodeReserved): string {
        const qk = _.encode([(s) => s, k]);
        const qv = _.encode([(s) => s, v]);
        // don't add index to arrays
        // https://github.com/expressjs/body-parser/issues/289
        const visit = (obj: any, prefix = ""): string => Object.entries(obj)
            .filter(([, v]) => v !== undefined)
            .map(([prop, v]) => {
            const index = Array.isArray(obj) ? "" : prop;
            const key = prefix ? qk `${prefix}[${index}]` : prop;
            if (typeof v === "object") {
                return visit(v, key);
            }
            return qv `${key}=${v}`;
        })
            .join("&");
        return visit(params);
    },
    /**
     * Property values of type array or object generate separate parameters
     * for each value of the array, or key-value-pair of the map.
     * For other types of properties this property has no effect.
     * See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#encoding-object
     */
    explode(params: Record<string, any>, encoders = _.encodeReserved): string {
        const q = _.encode(encoders);
        return Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .map(([name, value]) => {
            if (Array.isArray(value)) {
                return value.map((v) => q `${name}=${v}`).join("&");
            }
            if (typeof value === "object") {
                return QS.explode(value, encoders);
            }
            return q `${name}=${value}`;
        })
            .join("&");
    },
    form: _.delimited(),
    pipe: _.delimited("|"),
    space: _.delimited("%20"),
};
export class HttpError extends Error {
    status: number;
    data?: object;
    constructor(status: number, message: string, url: string, text?: string) {
        super(`${url} - ${message} (${status})`);
        this.status = status;
        if (text) {
            try {
                this.data = JSON.parse(text);
            }
            catch (err) { }
        }
    }
}
export type ApiResult<Fn> = Fn extends (...args: any) => Promise<infer T> ? T : never;
export type create_user_dto = {
    name: string;
    email: string;
    password: string;
};
export type user_entity = {
    user_id: string;
    preferred_username: string;
    name: string;
    profile?: string;
    picture?: string;
    email: string;
    email_verified: boolean;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    user_type: "basic";
    created_at: string;
    updated_at: string;
    version: number;
};
export type validation_error_response = any;
export type authenticate_user_dto = {
    username: string;
    password: string;
    ip_address: string;
    user_agent: string;
};
export type error_object = {
    errors: {
        status: number;
        code: string;
        title: string;
        detail: string;
        source?: {
            pointer: string;
        };
        stack?: string;
    }[];
};
export type subscription = {
    subscription_id: string;
    product_id: string;
    price_id: string;
    stripe_subscription_id: string;
    current_period_end: number;
    current_period_start: number;
    status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
    cancel_at?: number;
    cancelled_at?: number;
    collection_method?: string;
    ended_at?: number;
    trial_start_at?: number;
    trial_end_at?: number;
};
export type payment_card_entity = {
    brand: string;
    country?: string;
    exp_month: number;
    exp_year: number;
    last4: string;
    three_d_secure_usage?: {
        supported: boolean;
    };
};
export type payment_method = {
    payment_method_id: string;
    stripe_payment_method_id: string;
    "type": "alipay" | "au_becs_debit" | "bacs_debit" | "bancontact" | "card" | "eps" | "fpx" | "giropay" | "ideal" | "p24" | "sepa_debit" | "sofort";
    billing_details?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            country?: string;
            state?: string;
            postal_code?: string;
        };
    };
    card?: payment_card_entity;
    is_default: boolean;
};
export type services = {
    service_id: string;
    status: "Pending" | "Provisioning" | "Ready" | "Failed" | "Disabled";
};
export type organisation_entity = {
    organisation_id: string;
    name: string;
    email: string;
    address?: {
        address_line_1: string;
        address_line_2?: string;
        city: string;
        region?: string;
        postal_code?: string;
        country_code: string;
    };
    tax_id?: string;
    stripe_tax_id?: string;
    payment_provider: string;
    payment_provider_ref: string;
    tax_status?: "none" | "exempt" | "reverse";
    subscriptions: subscription[];
    payment_methods: payment_method[];
    services: services[];
    created_at: string;
    updated_at: string;
    version: number;
};
export type member_entity = {
    membership_id: string;
    user_id: string;
    organisation_id: string;
    role: "Administrator" | "Team Member" | "Billing Only";
    user?: user_entity;
    organisation?: organisation_entity;
};
export type metadata_object = {
    count: number;
    page: {
        "number": number;
        size: number;
    };
};
export type change_user_password_dto = {
    old_password: string;
    new_password: string;
};
export type verify_user_email_dto = {
    email: string;
    code: string;
};
export type service_entity = {
    service_id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    version: number;
};
export type create_service_dto = {
    name: string;
    description?: string;
};
export type add_organisation_dto = {
    name: string;
    address?: {
        address_line_1: string;
        address_line_2?: string;
        city: string;
        region?: string;
        postal_code?: string;
        country_code: string;
    };
    tax_id?: string;
};
export type CreateBillingPortalSessionDto = {
    return_url: string;
};
export type billing_portal_session_entity = {
    portal_url: string;
};
export type invitation_entity = {
    invitation_id: string;
    organisation_id: string;
    user_id?: string;
    email?: string;
    status: "Created" | "Sent" | "Accepted" | "Deleted" | "Undelivered";
    role: "Administrator" | "Team Member" | "Billing Only";
    created_at: string;
    updated_at: string;
    deleted_at: string;
    version: number;
};
export type create_organisation_invitation_dto = {
    user_id?: string;
    email?: string;
    status?: "Created" | "Sent" | "Accepted" | "Deleted" | "Undelivered";
    role: "Administrator" | "Team Member" | "Billing Only";
};
export type add_billing_address_dto = {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    region?: string;
    postal_code?: string;
    country_code: string;
};
export type add_vat_registration_dto = {
    vat_number: string;
};
export type add_product_subscription_dto = {
    stripe_checkout_session_id: string;
};
export type add_payment_method_dto = {
    payment_provider: "stripe";
    payment_provider_ref: string;
    is_default: boolean;
};
export type TaxRateEntity = {
    stripe_tax_rate_id: string;
    active: boolean;
    description?: string;
    display_name: string;
    inclusive: boolean;
    jurisdiction: string;
    percentage: number;
};
export type country_entity = {
    id: string;
    name: string;
    dialingCode: string;
    isoCode: string;
    isEuMemberCountry: boolean;
    euCountryCode: string;
    vatRate: number;
    hasPostalCode: boolean;
    tax_rates?: TaxRateEntity[];
};
export type price_entity = {
    price_id: string;
    currency: string;
    amount: number;
    is_active: boolean;
    recurring: "month" | "annual";
    recurring_frequency: number;
};
export type product_entity = {
    product_id: string;
    name: string;
    description?: string;
    is_active: boolean;
    prices: price_entity[];
    metadata?: object;
};
export type authenticate_client_dto = {
    client_id: string;
    secret: string;
    ip_address: string;
    user_agent: string;
};
export type client_entity = {
    client_id: string;
    identifier: string;
    is_public: boolean;
    redirect_uris: string[];
    backchannel_logout_supported: boolean;
    backchannel_logout_uri?: string;
    scopes: string[];
    audiences: string[];
    client_type: string;
    description?: string;
    user_id?: string;
    organisation_id?: string;
    created_at: string;
    updated_at: string;
    version: number;
};
export type create_stripe_checkout_session_dto = {
    organisation_id: string;
    product_id: string;
    price_id: string;
    cancel_url: string;
    success_url: string;
};
export type session_entity = {
    session_id: string;
};
export type create_invitation_dto = {
    organisation_id: string;
    user_id?: string;
    email?: string;
    role: "Administrator" | "Team Member" | "Billing Only";
};
export type change_member_role_dto = {
    role: "Administrator" | "Team Member" | "Billing Only";
};
export async function createUser(createUserDto: create_user_dto, opts?: RequestOpts) {
    return await _.fetchJson("/users/create", _.json({
        ...opts,
        method: "POST",
        body: createUserDto
    })) as user_entity;
}
export async function authenticateUser(authenticateUserDto: authenticate_user_dto, opts?: RequestOpts) {
    return await _.fetchJson("/users/authenticate", _.json({
        ...opts,
        method: "POST",
        body: authenticateUserDto
    })) as user_entity;
}
export async function getUserProfile(userId: string, opts?: RequestOpts) {
    return await _.fetchJson(`/users/${userId}`, {
        ...opts
    }) as user_entity;
}
export async function listUserMemberships(userId: string, { include, page }: {
    include?: "organisation";
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/users/${userId}/memberships${QS.query(QS.pipe({
        include
    }), QS.deep({
        page
    }))}`, {
        ...opts
    }) as {
        data: member_entity[];
        metadata: metadata_object;
    };
}
export async function changeUserPassword(userId: string, changeUserPasswordDto: change_user_password_dto, opts?: RequestOpts) {
    return await _.fetchJson(`/users/${userId}/change-password`, _.json({
        ...opts,
        method: "POST",
        body: changeUserPasswordDto
    })) as user_entity;
}
export async function verifyUserEmail(verifyUserEmailDto: verify_user_email_dto, opts?: RequestOpts) {
    return await _.fetchJson("/users/verify-email", _.json({
        ...opts,
        method: "POST",
        body: verifyUserEmailDto
    })) as user_entity;
}
export async function listServices({ page }: {
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/services${QS.query(QS.deep({
        page
    }))}`, {
        ...opts
    }) as {
        data: service_entity[];
        metadata: metadata_object;
    };
}
export async function addService(createServiceDto: create_service_dto, opts?: RequestOpts) {
    return await _.fetchJson("/services/add", _.json({
        ...opts,
        method: "POST",
        body: createServiceDto
    })) as service_entity;
}
export async function findServiceById(serviceId: string, opts?: RequestOpts) {
    return await _.fetchJson(`/services/${serviceId}`, {
        ...opts
    }) as service_entity;
}
export async function listOrganisations({ include, filter, page }: {
    include?: "owner";
    filter?: {
        owner_id?: string;
    };
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations${QS.query(QS.pipe({
        include
    }), QS.deep({
        filter,
        page
    }))}`, {
        ...opts
    }) as {
        data: organisation_entity[];
        metadata: metadata_object;
    };
}
export async function addOrganisation(addOrganisationDto: add_organisation_dto, opts?: RequestOpts) {
    return await _.fetchJson("/organisations/add", _.json({
        ...opts,
        method: "POST",
        body: addOrganisationDto
    })) as organisation_entity;
}
export async function findOrganisationById(organisationId: string, { include }: {
    include?: "owner";
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}${QS.query(QS.pipe({
        include
    }))}`, {
        ...opts
    }) as organisation_entity;
}
export async function createBillingPortalSession(organisationId: string, createBillingPortalSessionDto: CreateBillingPortalSessionDto, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/create-billing-portal-session`, _.json({
        ...opts,
        method: "POST",
        body: createBillingPortalSessionDto
    })) as billing_portal_session_entity;
}
export async function listOrganisationInvitations(organisationId: string, { page }: {
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/invitations${QS.query(QS.deep({
        page
    }))}`, {
        ...opts
    }) as {
        data: invitation_entity[];
        metadata: metadata_object;
    };
}
export async function createOrganisationInvitation(organisationId: string, createOrganisationInvitationDto: create_organisation_invitation_dto, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/invitations/create`, _.json({
        ...opts,
        method: "POST",
        body: createOrganisationInvitationDto
    })) as invitation_entity;
}
export async function listOrganisationMembers(organisationId: string, { include, page }: {
    include?: "organisation" | "user";
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/members${QS.query(QS.pipe({
        include
    }), QS.deep({
        page
    }))}`, {
        ...opts
    }) as {
        data: member_entity[];
        metadata: metadata_object;
    };
}
export async function addBillingAddress(organisationId: string, addBillingAddressDto: add_billing_address_dto, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/add-billing-address`, _.json({
        ...opts,
        method: "POST",
        body: addBillingAddressDto
    })) as organisation_entity;
}
export async function addVatRegistration(organisationId: string, addVatRegistrationDto: add_vat_registration_dto, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/add-vat-registration`, _.json({
        ...opts,
        method: "POST",
        body: addVatRegistrationDto
    })) as organisation_entity;
}
export async function addProductSubscription(organisationId: string, addProductSubscriptionDto: add_product_subscription_dto, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/add-subscription`, _.json({
        ...opts,
        method: "POST",
        body: addProductSubscriptionDto
    })) as organisation_entity;
}
export async function addPaymentMethod(organisationId: string, addPaymentMethodDto: add_payment_method_dto, opts?: RequestOpts) {
    return await _.fetchJson(`/organisations/${organisationId}/add-payment-method`, _.json({
        ...opts,
        method: "POST",
        body: addPaymentMethodDto
    })) as organisation_entity;
}
export async function listCountries({ page }: {
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/countries${QS.query(QS.deep({
        page
    }))}`, {
        ...opts
    }) as {
        data: country_entity[];
        metadata: metadata_object;
    };
}
export async function findCountryByIsoCode(isoCountryCode: string, opts?: RequestOpts) {
    return await _.fetchJson(`/countries/${isoCountryCode}`, {
        ...opts
    }) as country_entity;
}
export async function listProducts({ page }: {
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/products${QS.query(QS.deep({
        page
    }))}`, {
        ...opts
    }) as product_entity[];
}
export async function findProductById(productId: string, opts?: RequestOpts) {
    return await _.fetchJson(`/products/${productId}`, {
        ...opts
    }) as product_entity;
}
export async function authenticateClient(authenticateClientDto: authenticate_client_dto, opts?: RequestOpts) {
    return await _.fetchJson("/clients/authenticate", _.json({
        ...opts,
        method: "POST",
        body: authenticateClientDto
    })) as client_entity;
}
export async function getClientProfile(clientId: string, opts?: RequestOpts) {
    return await _.fetchJson(`/clients/${clientId}`, {
        ...opts
    }) as client_entity;
}
export async function createCheckoutSession(createStripeCheckoutSessionDto: create_stripe_checkout_session_dto, opts?: RequestOpts) {
    return await _.fetchJson("/checkout-sessions/create", _.json({
        ...opts,
        method: "POST",
        body: createStripeCheckoutSessionDto
    })) as session_entity;
}
export async function findCheckoutSession(stripeSessionId: string, opts?: RequestOpts) {
    return await _.fetchJson(`/checkout-sessions/${stripeSessionId}`, {
        ...opts
    }) as session_entity;
}
export async function listInvitations({ include }: {
    include?: "organisation" | "user";
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/invitations${QS.query(QS.pipe({
        include
    }))}`, {
        ...opts
    }) as invitation_entity[];
}
export async function createInvitation(createInvitationDto: create_invitation_dto, opts?: RequestOpts) {
    return await _.fetchJson("/invitations/create", _.json({
        ...opts,
        method: "POST",
        body: createInvitationDto
    })) as invitation_entity;
}
export async function findInvitation(invitationId: string, { include }: {
    include?: "organisation" | "user";
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/invitations/${invitationId}${QS.query(QS.pipe({
        include
    }))}`, {
        ...opts
    }) as invitation_entity;
}
export async function acceptInvitation(invitationId: string, opts?: RequestOpts) {
    return await _.fetchJson(`/invitations/${invitationId}/accept`, {
        ...opts,
        method: "POST"
    }) as invitation_entity;
}
export async function deleteInvitation(invitationId: string, opts?: RequestOpts) {
    return await _.fetch(`/invitations/${invitationId}/delete`, {
        ...opts,
        method: "POST"
    });
}
export async function listMembers({ include, page }: {
    include?: "organisation" | "user";
    page?: {
        size?: number;
        "number"?: number;
    };
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/members${QS.query(QS.pipe({
        include
    }), QS.deep({
        page
    }))}`, {
        ...opts
    }) as {
        data: member_entity[];
        metadata: metadata_object;
    };
}
export async function findMemberById(membershipId: string, { include }: {
    include?: "organisation" | "user";
} = {}, opts?: RequestOpts) {
    return await _.fetchJson(`/members/${membershipId}${QS.query(QS.pipe({
        include
    }))}`, {
        ...opts
    }) as member_entity;
}
export async function changeMemberRole(membershipId: string, changeMemberRoleDto: change_member_role_dto, opts?: RequestOpts) {
    return await _.fetchJson(`/members/${membershipId}/change-role`, _.json({
        ...opts,
        method: "POST",
        body: changeMemberRoleDto
    })) as member_entity;
}
export async function deleteMemberById(membershipId: string, opts?: RequestOpts) {
    return await _.fetch(`/members/${membershipId}/delete`, {
        ...opts,
        method: "POST"
    });
}
