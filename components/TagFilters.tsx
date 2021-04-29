import React, { Fragment } from 'react';
import { Chip, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import { ITag } from '../interfaces';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridChips: {},
        chip: {
            margin: theme.spacing(0.4),
        },
    }),
);

export interface ITagFiltersProps {
    tags?: ITag[];
    onTagsChange: (selected: string[]) => void;
}

export default function TagFilters({ tags, onTagsChange }: ITagFiltersProps): JSX.Element {
    const classes = useStyles();
    const [chipDataActive, setChipDataActive] = React.useState<string[]>([]);

    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.gridChips}>
                    {tags?.map((data) => {
                        const active = chipDataActive.includes(data.id);
                        return (
                            <Chip
                                key={data.id}
                                label={data.title}
                                color={active ? 'primary' : 'default'}
                                className={classes.chip}
                                onDelete={
                                    active
                                        ? () => {
                                              const activeChange = chipDataActive;
                                              const index = activeChange.indexOf(data.id);
                                              index != -1 && activeChange.splice(index, 1);
                                              setChipDataActive(activeChange);
                                              onTagsChange(activeChange);
                                          }
                                        : undefined
                                }
                                onClick={
                                    !active
                                        ? () => {
                                              setChipDataActive([data.id, ...chipDataActive]);
                                              onTagsChange([data.id, ...chipDataActive]);
                                          }
                                        : undefined
                                }
                                clickable={!active}
                            />
                        );
                    })}
                </Grid>
            </Grid>
        </Fragment>
    );
}
