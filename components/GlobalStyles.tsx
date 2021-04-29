import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        '@global': {
            '*': {
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
            },
            html: {
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale',
                height: '100%',
                width: '100%',
            },
            body: {
                height: '100%',
                width: '100%',
                overflowX: 'hidden',
                'scroll-behavior': 'smooth',
            },
            a: {
                textDecoration: 'none',
                color: theme.palette.secondary.main,
                '&:visited': {
                    color: theme.palette.secondary.main,
                },
            },
            '#root': {
                height: '100%',
                width: '100%',
            },
            /* width */
            '::-webkit-scrollbar': {
                width: '10px',
            },

            /* Track */
            '::-webkit-scrollbar-track': {
                background: '#f1f1f1',
            },

            /* Handle */
            '::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '50px',
            },

            /* Handle on hover */
            '::-webkit-scrollbar-thumb:hover': {
                background: '#555',
            },
        },
    }),
);

const GlobalStyles = (): null => {
    useStyles();

    return null;
};

export default GlobalStyles;
