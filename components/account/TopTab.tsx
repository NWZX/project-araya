import React from 'react';

import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import BusinessIcon from '@material-ui/icons/Business';
import Inventory from 'icons/Inventory';
import { useRouter } from 'next/router';

interface Props {
    selected?: number;
}

const TopTab: React.FC<Props> = ({ selected }) => {
    const router = useRouter();

    return (
        <BottomNavigation value={selected} showLabels>
            <BottomNavigationAction
                label="Retour"
                icon={<HomeIcon />}
                onClick={() => {
                    router.push('/');
                }}
            />
            <BottomNavigationAction
                label="Commandes"
                icon={<Inventory />}
                onClick={() => {
                    router.push('/account');
                }}
            />
            <BottomNavigationAction
                label="Mon Profil"
                icon={<AccountCircleIcon />}
                onClick={() => {
                    router.push('/account/profile');
                }}
            />
            <BottomNavigationAction
                label="Mon Restaurant"
                icon={<BusinessIcon />}
                onClick={() => {
                    router.push('/account/registerStore');
                }}
            />
        </BottomNavigation>
    );
};

export default TopTab;
