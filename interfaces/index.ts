import {
    Length,
    IsEmail,
    IsOptional,
    ValidateNested,
    IsPostalCode,
    IsISO31661Alpha2,
    IsPhoneNumber,
    Min,
    Max,
    IsObject,
    MaxLength,
    IsNotEmpty,
    IsEnum,
    IsInt,
} from 'class-validator';
import firebase from 'firebase-admin';
import { createContext, Dispatch, SetStateAction } from 'react';
// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

//#region Other
export class IAddress {
    @Length(2, 255, { message: 'Doit être compris entre 2-255 caractère' })
    street: string;
    @IsOptional()
    @Length(2, 255, { message: 'Doit être compris entre 2-255 caractère' })
    optional?: string;
    @IsPostalCode('FR', { message: 'Code postale invalide.' })
    zipcode: string;
    @Length(2, 255, { message: 'Doit être compris entre 2-255 caractère' })
    city: string;
    @IsISO31661Alpha2()
    country: string;
}
export class IAddressGeo {
    @Length(2, 255, { message: 'Doit être compris entre 2-255 caractère' })
    street: string;
    @IsOptional()
    @Length(2, 255, { message: 'Doit être compris entre 2-255 caractère' })
    optional?: string;
    @IsPostalCode('FR', { message: 'Code postale invalide.' })
    zipcode: string;
    @Length(2, 255, { message: 'Doit être compris entre 2-255 caractère' })
    city: string;
    @IsISO31661Alpha2()
    country: string;
    @IsObject()
    geolocation: firebase.firestore.GeoPoint;
}

export class IContact {
    @IsPhoneNumber(undefined, { message: 'Numéro de téléphone invalide' })
    phone: string;
    @IsEmail(undefined, { message: 'Email invalide' })
    email: string;
}
export class IOrderRecipe {
    total: number;
    item: { id: string; name: string; option?: string[]; qty: number; total: number }[];
}
export enum EServiceType {
    TakeAway,
    OnSpot,
    Delivery,
}
export enum EDelivreryStatus {
    Pedding, //Attente de payement
    Rejected, // Payement Refuser
    Validated, // Payement validé
    Accepted, // Commande accepter par le marchand / en cours de preparation
    Refund, // Commande refuser par le marchand / remboursement
    Available, // Commande disponible en point de vente
    Collected, // Commande pris en charge par un livreur
    Delivered, // Commande remis au client
}
export enum EUsersRank {
    System = 0,
    Admin = 1,
    Merchand = 2,
    SubMerchand = 3,
    Deliverer = 4,
    Customer = 5,
}
//#endregion
//#region Customer
export class ICustomer {
    @IsOptional()
    id?: string;

    @IsOptional()
    ref?: firebase.firestore.DocumentReference;

    @Length(2, 30, { message: 'Doit être compris entre 2-30 caractère' })
    firstName: string;

    @ValidateNested()
    private: ICustomerPrivate;

    createdAt: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}
class ICustomerPrivate {
    @Length(2, 30, { message: 'Doit être compris entre 2-30 caractère' })
    lastName: string;

    @IsOptional()
    birthDate?: firebase.firestore.Timestamp;

    @ValidateNested()
    invoiceAddress: IAddress;
    @ValidateNested()
    deliveryAddress?: IAddressGeo[];
    @ValidateNested()
    contact: IContact;

    @IsOptional()
    stripeId?: string;
}
//#endregion
//#region Store
export class IStore {
    @IsOptional()
    id?: string;

    @IsOptional()
    ref?: string;

    @Length(2, 30, { message: 'Doit être compris entre 2-30 caractère' })
    title: string;

    @MaxLength(10, { message: '10 tags maximum' })
    tags: string[];

    @ValidateNested()
    address: IAddressGeo;

    @ValidateNested()
    contact: IContact;

    @Min(1000)
    @Max(10000)
    minToOrder: number;

    @Min(1000)
    @Max(10000)
    @IsOptional()
    deliveryFee?: number;

    @MaxLength(10, { message: '10 group maximum' })
    productGroup: IProductGroup[];

    serviceType: {
        isTakeAway?: boolean;
        isOnSpot?: boolean;
        isDelivery?: boolean;
    };

    @IsOptional()
    imageUrl?: string;

    @IsOptional()
    imageMobileUrl?: string;

    @ValidateNested()
    private: IStorePrivate;

    createdAt: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}
class IStorePrivate {
    @ValidateNested()
    owner: IOwner;

    @IsOptional()
    stripeId?: string;
}
export class IStoreReview {
    storeId: string;
    customer: {
        id: string;
        firstName: string;
        lastName: string;
    };
    score: number;
    review: string;
}
export class IOwner {
    @Length(2, 30)
    firstName: string;
    @Length(2, 30)
    lastName: string;
    @ValidateNested()
    address: IAddress;
    @ValidateNested()
    contact: IContact;
}
//#endregion
//#region Product
export class IProductGroup {
    @IsOptional()
    id?: string;

    @IsOptional()
    ref?: firebase.firestore.DocumentReference;

    @Length(2, 255)
    title: string;

    @Min(0)
    @Max(100)
    @IsInt()
    index: number;

    storeId: string;
}
export class IProduct {
    @IsOptional()
    id?: string;

    @IsOptional()
    ref?: firebase.firestore.DocumentReference;

    @IsNotEmpty()
    productGroupId: string;

    @IsNotEmpty()
    storeId: string;

    @Length(2, 255)
    title: string;

    @Length(20, 255)
    description: string;

    @Min(50)
    @Max(100000)
    @IsInt()
    price: number;

    @Min(210)
    @Max(2000)
    @IsInt()
    vat: number;

    @MaxLength(20, { each: true })
    @ValidateNested()
    optionGroup: IProductOptionGroup[];

    createdAt: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}
export enum EProductOptionGroupType {
    Unlinked,
    Linked,
}
export class IProductOptionGroup {
    @Length(2, 255)
    title: string;

    id: string;

    type: boolean;

    @MaxLength(10, { each: true })
    @ValidateNested()
    option: IProductOption[];
}
export class IProductOption {
    id: string;
    @Length(2, 255)
    title: string;
    @Min(50)
    @Max(10000)
    @IsInt()
    price: number;
}

//#endregion
//#region Order
export class IOrder {
    @IsOptional()
    id?: string;

    @IsOptional()
    ref?: firebase.firestore.DocumentReference;

    @IsNotEmpty()
    storeId: string;

    @IsNotEmpty()
    customerId: string;

    @IsEnum(EDelivreryStatus)
    status: EDelivreryStatus;

    deliveryMode: EServiceType;

    @Length(10, 500)
    @IsOptional()
    detail?: string;

    client: { displayName: string; address?: IAddressGeo };

    @ValidateNested()
    recipe: IOrderRecipe;

    createdAt: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}
//#endregion
//#region Deliveror
export class IDeliveror {
    @IsOptional()
    id?: string;

    @IsOptional()
    ref?: string;

    @Length(2, 30)
    firstName: string;

    isInService: boolean;

    currentLocation: firebase.firestore.GeoPoint;

    private: IDeliverorPrivate;

    createdAt: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}
class IDeliverorPrivate {
    @Length(2, 30)
    lastName: string;

    @ValidateNested()
    address: IAddress;

    @ValidateNested()
    contact: IContact;
}
export class IDeliverorReview {
    deliverorId: string;
    customer: {
        id: string;
        firstName: string;
        lastName: string;
    };
    score: number;
    review: string;

    createdAt: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}
//#endregion
//#region Tags
export class ITag {
    id: string;

    @IsOptional()
    ref?: string;

    @Length(2, 20, { message: 'Doit être compris entre 2-20 caractère' })
    title: string;
}
//#endregion

//#region React Context
export const DialogDataContext = createContext<{
    selectProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
    addProduct?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
    updateProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
    addGroup?: [boolean, Dispatch<SetStateAction<boolean>>];
    delGroup?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
}>({});
//#endregion

//#region Nominatim
export class INominatimReverseResult {
    type: string;
    licence: string;
    features: [
        {
            type: string;
            properties: {
                place_id: number;
                osm_type: string;
                osm_id: number;
                place_rank: number;
                category: string;
                type: string;
                importance: number;
                addresstype: string;
                name: string;
                display_name: string;
                address: {
                    road: string;
                    isolated_dwelling: string;
                    village: string;
                    town: string;
                    municipality: string;
                    state: string;
                    postcode: string;
                    country: string;
                    country_code: string;
                };
            };
            bbox: number[];
            geometry: {
                type: string;
                coordinates: number[];
            };
        },
    ];
}
//#endregion