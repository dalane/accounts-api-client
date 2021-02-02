import { defaults, servers as ApiServers, RequestOpts, HttpError, createClient, CreateClientDto, verify_user_email_dto, listProducts, findProductById, listOrganisations, addOrganisation, addProductSubscription, addBillingAddress, listCountries, findCountryByIsoCode, getUserProfile, findOrganisationById, changeUserPassword, createCheckoutSession, findCheckoutSession, findServiceById, listServices, metadata_object, organisation_entity, service_entity, create_stripe_checkout_session_dto, add_product_subscription_dto, add_billing_address_dto, add_organisation_dto, product_entity, change_user_password_dto, user_entity, country_entity, billing_portal_session_entity, createBillingPortalSession, CreateBillingPortalSessionDto, authenticate_user_dto, create_user_dto, authenticate_client_dto, client_entity, getClientProfile, authenticateClient, createUser, verifyUserEmail, authenticateUser } from './client';
import Debug from 'debug';
import { HTTP_STATUS_CODES } from './constants';
import { DomainAttributeError, DomainServiceUnavailableError, ErrorObject, SerializedErrorPayload, deserializeErrorObject, createDomainValidationError, createDomainInternalServerError } from './errors';
import CircuitBreaker from 'opossum';
import { getFetch } from './fetch';

const debug = Debug('app:services:accounts-api');

export interface CountryEntity extends country_entity {}

export interface VerifyUserEmailDto extends verify_user_email_dto {}

export interface UserEntity extends user_entity {}

export interface ChangeUserPasswordDto extends change_user_password_dto {}

export interface ProductEntity extends product_entity {}

export interface OrganisationEntity extends organisation_entity {}

export interface AddOrganisationDto extends add_organisation_dto {}

export interface AddProductSubscriptionDto extends add_product_subscription_dto {}

export interface CreateCheckoutSessionDto extends create_stripe_checkout_session_dto {}

export interface BillingPortalSessionEntity extends billing_portal_session_entity {}

export interface AuthenticateUserDto extends authenticate_user_dto {}

export interface CreateNewUserDto extends create_user_dto {}

export interface AuthenticateClientDto extends authenticate_client_dto {}

export interface ClientEntity extends client_entity {};

export { CreateBillingPortalSessionDto };

export interface SessionEntity {
	session_id: string;
}

export interface ServiceEntity extends service_entity {}

export interface AccountsApiService {
	client: {
		getClientProfile: (token: string, client_id: string) => Promise<ClientEntity | Error>;
		authenticateClient: (token: string, params: AuthenticateClientDto) => Promise<ClientEntity | Error>;
		createClient: (token: string, params: CreateClientDto) => Promise<ClientEntity | Error>;
	};
	users: {
		create: (token: string, dto: CreateNewUserDto) => Promise<UserEntity | Error>;
		verifyEmail: (token: string, dto: VerifyUserEmailDto) => Promise<UserEntity | Error>;
		findById: (token: string, userId:string) => Promise<UserEntity | Error>;
		changePassword: (token: string, userId:string, dto: ChangeUserPasswordDto) => Promise<UserEntity | Error>;
		authenticate: (token: string, dto: AuthenticateUserDto) => Promise<UserEntity | Error>;
	};
	countries: {
		list: (token: string, ) => Promise<CollectionResponse<CountryEntity>|Error>;
		findByIsoCode: (token: string, isoCode:string) => Promise<CountryEntity|Error>;
	};
	products: {
		list: (token: string, params?: CollectionParams) => Promise<ProductEntity[]|Error>;
		findById: (token: string, product_id:string) => Promise<ProductEntity|Error>;
	};
	organisations: {
		addBillingAddress: (token: string, organisation_id: string, dto: add_billing_address_dto) => Promise<OrganisationEntity | Error>;
		findById: (token: string, organisation_id:string) => Promise<OrganisationEntity | Error>;
		list: (token: string,  params?: CollectionParams & IncludeOwnerParam & FilterByOwnerParam ) => Promise<CollectionResponse<OrganisationEntity>|Error>;
		create: (token: string, dto:AddOrganisationDto) => Promise<OrganisationEntity | Error>;
		/**
		 * Add a subscription to the organisation after receiving confirmation of a
		 * successful  payment from stripe checkout.
		 */
		addSubscription: (token: string, organisationId:string, dto:AddProductSubscriptionDto) => Promise<OrganisationEntity|Error>;
		createBillingPortalSession: (token: string, organisation_id: string, dto: CreateBillingPortalSessionDto) => Promise<BillingPortalSessionEntity | Error>;
	};
	checkoutSessions: {
		findById: (token: string, session_id:string) => Promise<any|Error>;
		create: (token: string, dto:CreateCheckoutSessionDto) => Promise<SessionEntity|Error>;
	};
	services: {
		list: (token: string, params?: CollectionParams) => Promise< CollectionResponse<ServiceEntity> | Error >;
		findById: (token: string, service_id: string) => Promise< ServiceEntity | Error >;
	};
}

export interface CollectionParams {
	page?: {
		size?: number;
		"number"?: number;
	};
}

export interface IncludeOwnerParam {
	include?: "owner";
}

export interface FilterByOwnerParam {
	filter?: {
		owner_id?: string;
	};
}

export interface CollectionResponse<T> {
	data: T[];
	metadata: metadata_object;
}

export interface OAuthTokenParams {
	token_type: string;
	access_token: string;
}

export interface ApiClientSettings {
	/**
	 * URL to the API base including the version, e.g. "https: //projects.api.dalane.cloud/v1"
	 */
	baseUrl?: string;
	/**
	 * provide own instance of fetch library. Useful for mocking requests...
	 */
	fetch?: typeof fetch;
}

export function makeAccountsApiService(settings: ApiClientSettings):AccountsApiService {

	const { baseUrl, fetch } = settings;

	if (baseUrl === undefined) {
		defaults.baseUrl = ApiServers.live;
	} else {
		defaults.baseUrl = baseUrl;
	}

	defaults.credentials = 'include';
	defaults.fetch = fetch ?? getFetch();

	const circuitBreakerErrorHandler = makeCircuitBreakerErrorHandler();

	const makeHandler = <TI extends unknown[] = unknown[], TR = unknown>(callback:(...args:TI) => Promise<TR | Error>) => {
		const cb = new CircuitBreaker(async (...args:TI) => {
			return callback(...args).catch(clientErrorHandler);
		});
		return (...args:TI) => cb.fire(...args).catch(circuitBreakerErrorHandler);
	};

	// clients
	const findClientByIdHandler = makeHandler(getClientProfile);
	const authenticateClientHandler = makeHandler(authenticateClient);
	const createClientHandler = makeHandler(createClient);

	// users
	const createUserHandler = makeHandler(createUser);
	const verifyEmailHandler = makeHandler(verifyUserEmail);
	const authenticateUserHandler = makeHandler(authenticateUser);
	const findUserByIdHandler = makeHandler(getUserProfile);
	const changePasswordHandler = makeHandler(changeUserPassword);

	// countries
	const listCountriesHandler = makeHandler(listCountries);
	const findCountryHandler = makeHandler(findCountryByIsoCode);

	// products
	const listProductsHandler = makeHandler(listProducts);
	const findProductByIdHandler = makeHandler(findProductById);

	// organisations
	const findOrganisationHandler = makeHandler(findOrganisationById);
	const listOrganisationsHandler = makeHandler(listOrganisations);
	const createOrganisationHandler = makeHandler(addOrganisation);

	// subscriptions
	const addSubscriptionHandler = makeHandler(addProductSubscription);
	const findCheckoutSessionHandler = makeHandler(findCheckoutSession);
	const createCheckoutSessionHandler = makeHandler(createCheckoutSession);
	const findServiceHandler = makeHandler(findServiceById);
	const listServicesHandler = makeHandler(listServices);
	const createBillingPortalSessionHandler = makeHandler(createBillingPortalSession);
	const addBillingAddressHandler = makeHandler(addBillingAddress);

	return {
		client: {
			getClientProfile: async (token: string, client_id: string) => await findClientByIdHandler(client_id, createApiRequestOpts(token)),
			authenticateClient: async (token: string, params: AuthenticateClientDto) => await authenticateClientHandler(params, createApiRequestOpts(token)),
			createClient: async (token: string, dto: CreateClientDto) => await createClientHandler(dto, createApiRequestOpts(token))
		},
		users: {
			create: async (token: string, dto: CreateNewUserDto) => await createUserHandler(dto, createApiRequestOpts(token)),
			verifyEmail: async (token: string, dto: VerifyUserEmailDto) => await verifyEmailHandler(dto, createApiRequestOpts(token)),
			findById: async (token: string, userId:string) => await findUserByIdHandler(userId, createApiRequestOpts(token)),
			changePassword: async (token: string, userId:string, dto:ChangeUserPasswordDto) => await changePasswordHandler(userId, dto, createApiRequestOpts(token)),
			authenticate: async (token: string, dto: AuthenticateUserDto) => await authenticateUserHandler(dto, createApiRequestOpts(token)),
		},
		countries: {
			list: async (token: string, params?: CollectionParams) => listCountriesHandler(params, createApiRequestOpts(token)),
			findByIsoCode: async (token: string, isoCode:string) => findCountryHandler(isoCode, createApiRequestOpts(token))
		},
		products: {
			list: async (token: string, params?: CollectionParams) => listProductsHandler(params, createApiRequestOpts(token)),
			findById: async (token: string, product_id:string) => findProductByIdHandler(product_id, createApiRequestOpts(token)),
		},
		organisations: {
			addBillingAddress: async (token: string, organisation_id: string, dto: add_billing_address_dto) => addBillingAddressHandler(organisation_id, dto, createApiRequestOpts(token)),
			findById: async (token: string, organisationId:string, params?: IncludeOwnerParam) => findOrganisationHandler(organisationId, params, createApiRequestOpts(token)),
			list: async (token: string, params?: CollectionParams & IncludeOwnerParam & FilterByOwnerParam) => listOrganisationsHandler(params, createApiRequestOpts(token)),
			create: async (token: string, dto:AddOrganisationDto) => createOrganisationHandler(dto, createApiRequestOpts(token)),
			addSubscription: async (token: string, organisationId:string, dto:AddProductSubscriptionDto) => addSubscriptionHandler(organisationId, dto, createApiRequestOpts(token)),
			createBillingPortalSession: async (token: string, organisation_id: string, dto: CreateBillingPortalSessionDto) => createBillingPortalSessionHandler(organisation_id, dto, createApiRequestOpts(token))
		},
		checkoutSessions: {
			findById: async (token: string, session_id:string) => findCheckoutSessionHandler(session_id, createApiRequestOpts(token)),
			create: async (token: string, dto:CreateCheckoutSessionDto) => createCheckoutSessionHandler(dto, createApiRequestOpts(token))
		},
		services: {
			findById: async (token: string, service_id: string) => findServiceHandler(service_id, createApiRequestOpts(token)),
			list: async (token: string, params?: CollectionParams) => listServicesHandler(params, createApiRequestOpts(token))
		}
	};

}

const createUndefinedErrorData = (status: HTTP_STATUS_CODES) => ({
  status,
  title: 'Projects API Server Error',
  detail: 'The server did not provide details on the error'
});

/**
 * HttpError errors will be parsed and returned to the calling function to deal with.
 * These will include Validation, Not Found, etc. FetchError's will be normalised into
 * standard errors then thrown and all other errors will be thrown as is. All functions
 * are wrapped by a circuit breaker and the circuit breaker will deal with all thrown
 * errors.
 */
function clientErrorHandler(error: HttpError) {

	debug('API client threw error:', error);
		const errors: ErrorObject[] = error.data === undefined ? [ createUndefinedErrorData(error.status) ] : (<SerializedErrorPayload>error.data).errors;
		if (error.status === HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY) {
			const attributeErrors = <DomainAttributeError[]>errors.map(deserializeErrorObject);
			return createDomainValidationError('There are validation errors', attributeErrors);
		} else {
			return deserializeErrorObject(errors[0]);
		}
}

/**
 * The error handler will handle thrown errors from the client. It will check
 * for errors that require user input, i.e. 400 <= Status < 500 and those that
 * indicate that the circuit breaker should handle Status >= 500...
 * @param logger
 */
function makeCircuitBreakerErrorHandler() {
	return function(error:Error) {
		debug('Circuit Breaker Threw Error:', error.message);
		return new DomainServiceUnavailableError('The service is unavailable', error);
	};
}

function createApiRequestOpts(token?: string):RequestOpts {
	if (token === undefined) {
		throw createDomainInternalServerError('There is no authorisation token.')
	}
	return {
		headers: {
			authorization: `Bearer ${token}`
		}
	};
}
