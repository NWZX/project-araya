import firebase from 'firebase';
import {
    EProductOptionGroupType,
    EServiceType,
    ICustomer,
    IDeliveror,
    IProduct,
    IProductOptionGroup,
    IStore,
} from '../interfaces';
import faker from 'faker';

/** Dummy user data. */
export const sampleCustomersData: ICustomer[] = [
    {
        id: '0',
        firstName: 'Alice',

        private: {
            lastName: 'Slane',
            birthDate: firebase.firestore.Timestamp.fromDate(new Date(2001, 5, 15)),
            contact: { email: 'alice@gmail.com', phone: '+596696000000' },
            invoiceAddress: { street: '', zipcode: '', city: '', country: 'MQ' },
        },
        createdAt: firebase.firestore.Timestamp.now(),
    },
];

export const sampleStoreData: IStore[] = [
    {
        id: '0',
        title: 'McDonald IMS',
        minToOrder: 1000,
        serviceType: [EServiceType.Delivery, EServiceType.TakeAway],
        contact: { email: 'alice@gmail.com', phone: '+596696000000' },
        address: {
            street: '',
            zipcode: '',
            city: '',
            country: 'MQ',
            geolocation: new firebase.firestore.GeoPoint(12, -61),
        },
        private: {
            owner: {
                firstName: 'Gladice',
                lastName: 'Ohms',
                contact: { email: 'alice@gmail.com', phone: '+596696000000' },
                address: { street: '', zipcode: '', city: '', country: 'mq' },
            },
        },
        createdAt: firebase.firestore.Timestamp.now(),
    },
];

export const makeProducts = (i: number): IProduct[] => {
    const products: IProduct[] = [];

    for (let n = 0; n < i; n++) {
        products.push({
            productGroupId: i.toString(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseInt(faker.commerce.price(100, 3000, 100)),
            optionGroup: [
                {
                    index: 0,
                    title: faker.commerce.color(),
                    type: EProductOptionGroupType.Linked,
                    option: [
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                    ],
                },
                {
                    index: 0,
                    title: faker.commerce.color(),
                    type: EProductOptionGroupType.Linked,
                    option: [
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                        { title: faker.commerce.productName(), price: parseInt(faker.commerce.price(50, 1000, 100)) },
                    ],
                },
            ],
            vat: 2000,
            createdAt: firebase.firestore.Timestamp.now(),
        });
    }
    return products;
};

export const sampleDeliverorData: IDeliveror[] = [
    {
        id: '0',
        firstName: 'Iris',
        isInService: false,
        currentLocation: new firebase.firestore.GeoPoint(14, -61),
        private: {
            lastName: 'Fluk',
            contact: { email: 'alice@gmail.com', phone: '+596696000000' },
            address: { street: '', zipcode: '', city: '', country: 'MQ' },
        },
        createdAt: firebase.firestore.Timestamp.now(),
    },
];
