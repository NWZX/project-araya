import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import TopBar from './TopBar';

type Props = {
    children?: ReactNode;
    title?: string;
    disableHeader?: boolean;
    disablePadding?: boolean;
};

const Layout = ({ children, title = 'Project Araya', disableHeader, disablePadding }: Props): JSX.Element => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        {!disableHeader && (
            <header>
                <TopBar disablePadding={disablePadding} />
            </header>
        )}
        {children}
        <footer></footer>
    </div>
);

export default Layout;
