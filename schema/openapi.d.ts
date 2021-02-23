import {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Components {
  namespace Parameters {
    namespace ClientIdPathParam {
      export type ClientId = string; // uuid
    }
    namespace InvitationIdPathParam {
      export type InvitationId = string; // uuid
    }
    namespace InvitationIncludeParam {
      export type Include = "organisation" | "user";
    }
    namespace IsoCountryCodePathParam {
      export type IsoCountryCode = string; // iso-country-code
    }
    namespace ListOrganisationFilterParam {
      export interface Filter {
        owner_id?: string; // uuid
      }
    }
    namespace MemberIncludeParam {
      export type Include = "organisation" | "user";
    }
    namespace MembershipIdPathParam {
      export type MembershipId = string; // uuid
    }
    namespace OrganisationIdPathParam {
      export type OrganisationId = string; // uuid
    }
    namespace OrganisationIncludeParam {
      export type Include = "owner";
    }
    namespace OrganisationMemberIncludeParam {
      export type Include = "organisation" | "user";
    }
    namespace PaginationQueryParam {
      export interface Page {
        /**
         * Specify the number of records to return in a page. The default is 100. 0 returns all records.
         */
        size?: number;
        number?: number;
      }
    }
    namespace ProductIdPathParam {
      export type ProductId = string;
    }
    namespace ServiceIdPathParam {
      export type ServiceId = string; // uuid
    }
    namespace StripeSessionIdPathParam {
      export type StripeSessionId = string;
    }
    namespace UserIdPathParam {
      export type UserId = string; // uuid
    }
    namespace UserMemberIncludeParam {
      export type Include = "organisation";
    }
  }
  namespace Responses {
    export type ValidationErrorResponse = Schemas.ErrorObject;
  }
  namespace Schemas {
    export interface AddBillingAddressDto {
      address_line_1: string;
      address_line_2?: string;
      city: string;
      region?: string;
      postal_code?: string;
      country_code: string; // iso-country-code
    }
    export interface AddOrganisationDto {
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
      owner_id?: string; // uuid
    }
    export interface AddPaymentMethodDto {
      payment_provider: "stripe";
      payment_provider_ref: string;
      is_default: boolean;
    }
    export interface AddProductSubscriptionDto {
      stripe_checkout_session_id: string;
    }
    export interface AddVatRegistrationDto {
      vat_number: string;
    }
    export interface AuthenticateClientDto {
      client_id: string; // uuid
      secret: string;
      /**
       * The client IP address is required to assist with protecting the account.
       */
      ip_address: string /* ipv4 */  | string /* ipv6 */ ;
      /**
       * The client user agent string is required to assist with protecting the account.
       */
      user_agent: string;
    }
    export interface AuthenticateUserDto {
      username: string; // email
      password: string;
      /**
       * The client IP address is required to assist with protecting the account.
       */
      ip_address: string /* ipv4 */  | string /* ipv6 */ ;
      /**
       * The client user agent string is required to assist with protecting the account.
       */
      user_agent: string;
    }
    export interface BillingPortalSessionEntity {
      portal_url: string; // uri
    }
    export interface ChangeMemberRoleDto {
      role: "Administrator" | "Team Member" | "Billing Only";
    }
    export interface ChangeUserPasswordDto {
      old_password: string;
      new_password: string;
    }
    export interface ClientEntity {
      client_id: string; // uuid
      secret?: string;
      identifier: string;
      is_public: boolean;
      redirect_uris: string /* uri */ [];
      backchannel_logout_supported: boolean;
      backchannel_logout_uri?: string; // uri
      scopes: string[];
      audiences: string[];
      client_type: string;
      description?: string;
      client_secret_expires_at?: number;
      user_id?: string; // uuid
      organisation_id?: string; // uuid
      created_at: string; // date-time
      updated_at: string; // date-time
      version: number;
    }
    export interface CountryEntity {
      id: string; // iso-country-code
      name: string;
      dialingCode: string;
      isoCode: string;
      isEuMemberCountry: boolean;
      euCountryCode: string;
      vatRate: number;
      hasPostalCode: boolean;
      tax_rates?: TaxRateEntity[];
    }
    export interface CreateBillingPortalSessionDto {
      return_url: string; // uri
    }
    export interface CreateClientDto {
      client_id?: string; // uuid
      identifier: string;
      is_public: boolean;
      redirect_uris: string /* uri */ [];
      backchannel_logout_supported: boolean;
      backchannel_logout_uri?: string; // uri
      scopes: string[];
      audiences: string[];
      client_type: string;
      description?: string;
      user_id?: string; // uuid
      organisation_id?: string; // uuid
      client_secret_expires_at?: number;
    }
    export interface CreateInvitationDto {
      organisation_id: string; // uuid
      user_id?: string; // uuid
      email?: string; // email
      role: "Administrator" | "Team Member" | "Billing Only";
    }
    export interface CreateOrganisationInvitationDto {
      user_id?: string; // uuid
      email?: string; // email
      status?: "Created" | "Sent" | "Accepted" | "Deleted" | "Undelivered";
      role: "Administrator" | "Team Member" | "Billing Only";
    }
    export interface CreateServiceDto {
      name: string;
      description?: string;
    }
    export interface CreateStripeCheckoutSessionDto {
      organisation_id: string; // uuid
      product_id: string;
      price_id: string;
      cancel_url: string; // uri
      success_url: string; // uri
    }
    export interface CreateUserDto {
      name: string;
      email: string; // email
      password: string;
    }
    export interface ErrorObject {
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
    }
    export interface InvitationEntity {
      invitation_id: string; // uuid
      organisation_id: string; // uuid
      user_id?: string; // uuid
      email?: string; // email
      status: "Created" | "Sent" | "Accepted" | "Deleted" | "Undelivered";
      role: "Administrator" | "Team Member" | "Billing Only";
      created_at: string; // date-time
      updated_at: string; // date-time
      deleted_at: string; // date-time
      version: number;
    }
    export type InvitationStatus = "Created" | "Sent" | "Accepted" | "Deleted" | "Undelivered";
    export interface MemberEntity {
      membership_id: string; // uuid
      user_id: string; // uuid
      organisation_id: string; // uuid
      role: "Administrator" | "Team Member" | "Billing Only";
      user?: UserEntity;
      organisation?: OrganisationEntity;
    }
    export type MemberRoles = "Administrator" | "Team Member" | "Billing Only";
    export interface MetadataObject {
      count: number;
      page: {
        number: number;
        size: number;
      };
    }
    export interface OrganisationEntity {
      organisation_id: string; // uuid
      name: string;
      email: string; // email
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
      subscriptions: Subscription[];
      payment_methods: PaymentMethod[];
      services: Services[];
      owner_id?: string; // uuid
      created_at: string; // date-time
      updated_at: string; // date-time
      version: number;
    }
    export interface PaymentCardEntity {
      brand: string;
      country?: string;
      exp_month: number;
      exp_year: number;
      last4: string;
      three_d_secure_usage?: {
        supported: boolean;
      };
    }
    export interface PaymentMethod {
      payment_method_id: string; // uuid
      stripe_payment_method_id: string;
      type: "alipay" | "au_becs_debit" | "bacs_debit" | "bancontact" | "card" | "eps" | "fpx" | "giropay" | "ideal" | "p24" | "sepa_debit" | "sofort";
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
      card?: PaymentCardEntity;
      is_default: boolean;
    }
    export interface PriceEntity {
      price_id: string;
      currency: string;
      amount: number;
      is_active: boolean;
      recurring: "month" | "annual";
      recurring_frequency: number;
    }
    export interface ProductEntity {
      product_id: string;
      name: string;
      description?: string;
      is_active: boolean;
      prices: PriceEntity[];
      metadata?: {
      };
    }
    export interface ServiceEntity {
      service_id: string; // uuid
      name: string;
      description?: string;
      created_at: string; // date-time
      updated_at: string; // date-time
      version: number;
    }
    export interface Services {
      service_id: string; // uuid
      status: "Pending" | "Provisioning" | "Ready" | "Failed" | "Disabled";
    }
    export interface SessionEntity {
      session_id: string;
    }
    export interface Subscription {
      subscription_id: string; // uuid
      product_id: string; // uuid
      price_id: string; // uuid
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
    }
    export interface TaxRateEntity {
      stripe_tax_rate_id: string;
      active: boolean;
      description?: string;
      display_name: string;
      inclusive: boolean;
      jurisdiction: string;
      percentage: number;
    }
    export interface UserEntity {
      user_id: string; // uuid
      preferred_username: string;
      name: string;
      profile?: string;
      picture?: string; // uri
      email: string; // email
      email_verified: boolean;
      zoneinfo?: string;
      locale?: string;
      phone_number?: string;
      phone_number_verified?: boolean;
      user_type: "basic";
      created_at: string; // date-time
      updated_at: string; // date-time
      version: number;
    }
    export interface VerifyUserEmailDto {
      email: string; // email
      code: string;
    }
  }
}
declare namespace Paths {
  namespace AcceptInvitation {
    namespace Responses {
      export type $200 = Components.Schemas.InvitationEntity;
    }
  }
  namespace AddBillingAddress {
    export type RequestBody = Components.Schemas.AddBillingAddressDto;
    namespace Responses {
      export type $200 = Components.Schemas.OrganisationEntity;
    }
  }
  namespace AddOrganisation {
    export type RequestBody = Components.Schemas.AddOrganisationDto;
    namespace Responses {
      export type $201 = Components.Schemas.OrganisationEntity;
    }
  }
  namespace AddPaymentMethod {
    export type RequestBody = Components.Schemas.AddPaymentMethodDto;
    namespace Responses {
      export type $200 = Components.Schemas.OrganisationEntity;
    }
  }
  namespace AddProductSubscription {
    export type RequestBody = Components.Schemas.AddProductSubscriptionDto;
    namespace Responses {
      export type $200 = Components.Schemas.OrganisationEntity;
    }
  }
  namespace AddService {
    export type RequestBody = Components.Schemas.CreateServiceDto;
    namespace Responses {
      export type $201 = Components.Schemas.ServiceEntity;
    }
  }
  namespace AddVatRegistration {
    export type RequestBody = Components.Schemas.AddVatRegistrationDto;
    namespace Responses {
      export type $200 = Components.Schemas.OrganisationEntity;
    }
  }
  namespace AuthenticateClient {
    export type RequestBody = Components.Schemas.AuthenticateClientDto;
    namespace Responses {
      export type $200 = Components.Schemas.ClientEntity;
    }
  }
  namespace AuthenticateUser {
    export type RequestBody = Components.Schemas.AuthenticateUserDto;
    namespace Responses {
      export type $200 = Components.Schemas.UserEntity;
    }
  }
  namespace ChangeMemberRole {
    export type RequestBody = Components.Schemas.ChangeMemberRoleDto;
    namespace Responses {
      export type $200 = Components.Schemas.MemberEntity;
    }
  }
  namespace ChangeUserPassword {
    export type RequestBody = Components.Schemas.ChangeUserPasswordDto;
    namespace Responses {
      export type $200 = Components.Schemas.UserEntity;
    }
  }
  namespace CreateBillingPortalSession {
    export type RequestBody = Components.Schemas.CreateBillingPortalSessionDto;
    namespace Responses {
      export type $201 = Components.Schemas.BillingPortalSessionEntity;
    }
  }
  namespace CreateCheckoutSession {
    export type RequestBody = Components.Schemas.CreateStripeCheckoutSessionDto;
    namespace Responses {
      export type $201 = Components.Schemas.SessionEntity;
    }
  }
  namespace CreateClient {
    export type RequestBody = Components.Schemas.CreateClientDto;
    namespace Responses {
      export type $201 = Components.Schemas.ClientEntity;
    }
  }
  namespace CreateInvitation {
    export type RequestBody = Components.Schemas.CreateInvitationDto;
    namespace Responses {
      export type $201 = Components.Schemas.InvitationEntity;
    }
  }
  namespace CreateOrganisationInvitation {
    export type RequestBody = Components.Schemas.CreateOrganisationInvitationDto;
    namespace Responses {
      export type $201 = Components.Schemas.InvitationEntity;
    }
  }
  namespace CreateUser {
    export type RequestBody = Components.Schemas.CreateUserDto;
    namespace Responses {
      export type $201 = Components.Schemas.UserEntity;
    }
  }
  namespace FindCheckoutSession {
    namespace Responses {
      export type $200 = Components.Schemas.SessionEntity;
    }
  }
  namespace FindCountryByIsoCode {
    namespace Responses {
      export type $200 = Components.Schemas.CountryEntity;
    }
  }
  namespace FindInvitation {
    namespace Responses {
      export type $200 = Components.Schemas.InvitationEntity;
    }
  }
  namespace FindMemberById {
    namespace Responses {
      export type $200 = Components.Schemas.MemberEntity;
    }
  }
  namespace FindOrganisationById {
    namespace Responses {
      export type $200 = Components.Schemas.OrganisationEntity;
    }
  }
  namespace FindProductById {
    namespace Responses {
      export type $200 = Components.Schemas.ProductEntity;
    }
  }
  namespace FindServiceById {
    namespace Responses {
      export type $200 = Components.Schemas.ServiceEntity;
    }
  }
  namespace GetClientProfile {
    namespace Responses {
      export type $200 = Components.Schemas.ClientEntity;
    }
  }
  namespace GetUserProfile {
    namespace Responses {
      export type $201 = Components.Schemas.UserEntity;
    }
  }
  namespace ListCountries {
    namespace Responses {
      export interface $200 {
        data: Components.Schemas.CountryEntity[];
        metadata: Components.Schemas.MetadataObject;
      }
    }
  }
  namespace ListInvitations {
    namespace Responses {
      export type $200 = Components.Schemas.InvitationEntity[];
    }
  }
  namespace ListMembers {
    namespace Responses {
      export interface $200 {
        data: Components.Schemas.MemberEntity[];
        metadata: Components.Schemas.MetadataObject;
      }
    }
  }
  namespace ListOrganisationInvitations {
    namespace Responses {
      export interface $200 {
        data: Components.Schemas.InvitationEntity[];
        metadata: Components.Schemas.MetadataObject;
      }
    }
  }
  namespace ListOrganisationMembers {
    namespace Responses {
      export interface $200 {
        data: Components.Schemas.MemberEntity[];
        metadata: Components.Schemas.MetadataObject;
      }
    }
  }
  namespace ListOrganisations {
    namespace Responses {
      export interface $200 {
        data: Components.Schemas.OrganisationEntity[];
        metadata: Components.Schemas.MetadataObject;
      }
    }
  }
  namespace ListProducts {
    namespace Responses {
      export type $200 = Components.Schemas.ProductEntity[];
    }
  }
  namespace ListServices {
    namespace Responses {
      export interface $200 {
        data: Components.Schemas.ServiceEntity[];
        metadata: Components.Schemas.MetadataObject;
      }
    }
  }
  namespace ListUserMemberships {
    namespace Responses {
      export interface $200 {
        data: Components.Schemas.MemberEntity[];
        metadata: Components.Schemas.MetadataObject;
      }
    }
  }
  namespace VerifyUserEmail {
    export type RequestBody = Components.Schemas.VerifyUserEmailDto;
    namespace Responses {
      export type $200 = Components.Schemas.UserEntity;
    }
  }
}

export interface OperationMethods {
  /**
   * CreateUser
   */
  'CreateUser'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateUser.Responses.$201>
  /**
   * AuthenticateUser
   */
  'AuthenticateUser'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AuthenticateUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AuthenticateUser.Responses.$200>
  /**
   * GetUserProfile
   */
  'GetUserProfile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUserProfile.Responses.$201>
  /**
   * ListUserMemberships
   */
  'ListUserMemberships'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListUserMemberships.Responses.$200>
  /**
   * ChangeUserPassword
   */
  'ChangeUserPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ChangeUserPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ChangeUserPassword.Responses.$200>
  /**
   * VerifyUserEmail
   */
  'VerifyUserEmail'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.VerifyUserEmail.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.VerifyUserEmail.Responses.$200>
  /**
   * ListServices
   */
  'ListServices'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListServices.Responses.$200>
  /**
   * AddService
   */
  'AddService'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AddService.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddService.Responses.$201>
  /**
   * FindServiceById
   */
  'FindServiceById'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FindServiceById.Responses.$200>
  /**
   * ListOrganisations
   */
  'ListOrganisations'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListOrganisations.Responses.$200>
  /**
   * AddOrganisation
   */
  'AddOrganisation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AddOrganisation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddOrganisation.Responses.$201>
  /**
   * FindOrganisationById
   */
  'FindOrganisationById'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FindOrganisationById.Responses.$200>
  /**
   * CreateBillingPortalSession
   */
  'CreateBillingPortalSession'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateBillingPortalSession.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateBillingPortalSession.Responses.$201>
  /**
   * ListOrganisationInvitations
   */
  'ListOrganisationInvitations'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListOrganisationInvitations.Responses.$200>
  /**
   * CreateOrganisationInvitation
   */
  'CreateOrganisationInvitation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateOrganisationInvitation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateOrganisationInvitation.Responses.$201>
  /**
   * ListOrganisationMembers
   */
  'ListOrganisationMembers'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListOrganisationMembers.Responses.$200>
  /**
   * AddBillingAddress
   */
  'AddBillingAddress'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AddBillingAddress.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddBillingAddress.Responses.$200>
  /**
   * AddVatRegistration
   */
  'AddVatRegistration'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AddVatRegistration.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddVatRegistration.Responses.$200>
  /**
   * AddProductSubscription
   */
  'AddProductSubscription'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AddProductSubscription.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddProductSubscription.Responses.$200>
  /**
   * AddPaymentMethod
   */
  'AddPaymentMethod'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AddPaymentMethod.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddPaymentMethod.Responses.$200>
  /**
   * ListCountries
   */
  'ListCountries'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListCountries.Responses.$200>
  /**
   * FindCountryByIsoCode
   */
  'FindCountryByIsoCode'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FindCountryByIsoCode.Responses.$200>
  /**
   * ListProducts
   */
  'ListProducts'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListProducts.Responses.$200>
  /**
   * FindProductById
   */
  'FindProductById'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FindProductById.Responses.$200>
  /**
   * CreateClient
   */
  'CreateClient'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateClient.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateClient.Responses.$201>
  /**
   * AuthenticateClient
   */
  'AuthenticateClient'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AuthenticateClient.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AuthenticateClient.Responses.$200>
  /**
   * GetClientProfile
   */
  'GetClientProfile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetClientProfile.Responses.$200>
  /**
   * CreateCheckoutSession
   */
  'CreateCheckoutSession'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateCheckoutSession.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateCheckoutSession.Responses.$201>
  /**
   * FindCheckoutSession
   */
  'FindCheckoutSession'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FindCheckoutSession.Responses.$200>
  /**
   * ListInvitations
   */
  'ListInvitations'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListInvitations.Responses.$200>
  /**
   * CreateInvitation
   */
  'CreateInvitation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateInvitation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateInvitation.Responses.$201>
  /**
   * FindInvitation
   */
  'FindInvitation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FindInvitation.Responses.$200>
  /**
   * AcceptInvitation
   */
  'AcceptInvitation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AcceptInvitation.Responses.$200>
  /**
   * DeleteInvitation
   */
  'DeleteInvitation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * ListMembers
   */
  'ListMembers'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListMembers.Responses.$200>
  /**
   * FindMemberById
   */
  'FindMemberById'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FindMemberById.Responses.$200>
  /**
   * ChangeMemberRole
   */
  'ChangeMemberRole'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ChangeMemberRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ChangeMemberRole.Responses.$200>
  /**
   * DeleteMemberById
   */
  'DeleteMemberById'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
}

export interface PathsDictionary {
  ['/users']: {
  }
  ['/users/create']: {
    /**
     * CreateUser
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateUser.Responses.$201>
  }
  ['/users/authenticate']: {
    /**
     * AuthenticateUser
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AuthenticateUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AuthenticateUser.Responses.$200>
  }
  ['/users/{user_id}']: {
    /**
     * GetUserProfile
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUserProfile.Responses.$201>
  }
  ['/users/{user_id}/memberships']: {
    /**
     * ListUserMemberships
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListUserMemberships.Responses.$200>
  }
  ['/users/{user_id}/change-password']: {
    /**
     * ChangeUserPassword
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ChangeUserPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ChangeUserPassword.Responses.$200>
  }
  ['/users/verify-email']: {
    /**
     * VerifyUserEmail
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.VerifyUserEmail.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.VerifyUserEmail.Responses.$200>
  }
  ['/services']: {
    /**
     * ListServices
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListServices.Responses.$200>
  }
  ['/services/add']: {
    /**
     * AddService
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddService.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddService.Responses.$201>
  }
  ['/services/{service_id}']: {
    /**
     * FindServiceById
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FindServiceById.Responses.$200>
  }
  ['/organisations']: {
    /**
     * ListOrganisations
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListOrganisations.Responses.$200>
  }
  ['/organisations/add']: {
    /**
     * AddOrganisation
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddOrganisation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddOrganisation.Responses.$201>
  }
  ['/organisations/{organisation_id}']: {
    /**
     * FindOrganisationById
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FindOrganisationById.Responses.$200>
  }
  ['/organisations/{organisation_id}/create-billing-portal-session']: {
    /**
     * CreateBillingPortalSession
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateBillingPortalSession.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateBillingPortalSession.Responses.$201>
  }
  ['/organisations/{organisation_id}/invitations']: {
    /**
     * ListOrganisationInvitations
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListOrganisationInvitations.Responses.$200>
  }
  ['/organisations/{organisation_id}/invitations/create']: {
    /**
     * CreateOrganisationInvitation
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOrganisationInvitation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateOrganisationInvitation.Responses.$201>
  }
  ['/organisations/{organisation_id}/members']: {
    /**
     * ListOrganisationMembers
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListOrganisationMembers.Responses.$200>
  }
  ['/organisations/{organisation_id}/add-billing-address']: {
    /**
     * AddBillingAddress
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddBillingAddress.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddBillingAddress.Responses.$200>
  }
  ['/organisations/{organisation_id}/add-vat-registration']: {
    /**
     * AddVatRegistration
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddVatRegistration.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddVatRegistration.Responses.$200>
  }
  ['/organisations/{organisation_id}/add-subscription']: {
    /**
     * AddProductSubscription
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddProductSubscription.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddProductSubscription.Responses.$200>
  }
  ['/organisations/{organisation_id}/add-payment-method']: {
    /**
     * AddPaymentMethod
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddPaymentMethod.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddPaymentMethod.Responses.$200>
  }
  ['/countries']: {
    /**
     * ListCountries
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListCountries.Responses.$200>
  }
  ['/countries/{iso_country_code}']: {
    /**
     * FindCountryByIsoCode
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FindCountryByIsoCode.Responses.$200>
  }
  ['/products']: {
    /**
     * ListProducts
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListProducts.Responses.$200>
  }
  ['/products/{product_id}']: {
    /**
     * FindProductById
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FindProductById.Responses.$200>
  }
  ['/clients/create']: {
    /**
     * CreateClient
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateClient.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateClient.Responses.$201>
  }
  ['/clients/authenticate']: {
    /**
     * AuthenticateClient
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AuthenticateClient.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AuthenticateClient.Responses.$200>
  }
  ['/clients/{client_id}']: {
    /**
     * GetClientProfile
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetClientProfile.Responses.$200>
  }
  ['/checkout-sessions/create']: {
    /**
     * CreateCheckoutSession
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateCheckoutSession.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateCheckoutSession.Responses.$201>
  }
  ['/checkout-sessions/{stripe_session_id}']: {
    /**
     * FindCheckoutSession
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FindCheckoutSession.Responses.$200>
  }
  ['/invitations']: {
    /**
     * ListInvitations
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListInvitations.Responses.$200>
  }
  ['/invitations/create']: {
    /**
     * CreateInvitation
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateInvitation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateInvitation.Responses.$201>
  }
  ['/invitations/{invitation_id}']: {
    /**
     * FindInvitation
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FindInvitation.Responses.$200>
  }
  ['/invitations/{invitation_id}/accept']: {
    /**
     * AcceptInvitation
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AcceptInvitation.Responses.$200>
  }
  ['/invitations/{invitation_id}/delete']: {
    /**
     * DeleteInvitation
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/members']: {
    /**
     * ListMembers
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListMembers.Responses.$200>
  }
  ['/members/{membership_id}']: {
    /**
     * FindMemberById
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FindMemberById.Responses.$200>
  }
  ['/members/{membership_id}/change-role']: {
    /**
     * ChangeMemberRole
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ChangeMemberRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ChangeMemberRole.Responses.$200>
  }
  ['/members/{membership_id}/delete']: {
    /**
     * DeleteMemberById
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
