import firebase from 'firebase';
import { ICustomer, IDeliverer } from 'interfaces';

/** Dummy user data. */
export const sampleCustomersData: ICustomer[] = [
    {
        id: '0',
        firstName: 'Alice',

        private: {
            lastName: 'Slane',
            birthDate: firebase.firestore.Timestamp.fromDate(new Date(2001, 5, 15)).toMillis(),
            contact: { email: 'alice@gmail.com', phone: '+596696000000' },
            invoiceAddress: { street: '', zipcode: '', city: '', country: 'MQ' },
        },
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
    },
];

export const sampleDeliverorData: IDeliverer[] = [
    {
        id: '0',
        firstName: 'Iris',
        isInService: false,
        currentLocation: new firebase.firestore.GeoPoint(14, -61),
        delivererCode: '17A35802B71-B8F791',
        storeIds: [''],
        private: {
            lastName: 'Fluk',
            contact: { email: 'alice@gmail.com', phone: '+596696000000' },
            address: { street: '', zipcode: '', city: '', country: 'MQ' },
            birthDate: 1624395230065,
        },
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
    },
];
