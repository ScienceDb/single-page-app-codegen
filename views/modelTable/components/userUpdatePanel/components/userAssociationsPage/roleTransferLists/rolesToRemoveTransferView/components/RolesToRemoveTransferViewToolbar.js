import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import ClearInactive from '@material-ui/icons/BackspaceOutlined';
import ClearActive from '@material-ui/icons/Backspace';
import Search from '@material-ui/icons/Search';
import DeleteList from '@material-ui/icons/DeleteTwoTone';
import AssociatedList from '@material-ui/icons/CheckBoxTwoTone';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  headers: {
    paddingTop: theme.spacing(2),
  },
  title: {
    paddingTop: theme.spacing(0),
  },
  id: {
    width: 33,
  },
  label: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function RolesToRemoveTransferViewToolbar(props) {
  const classes = useToolbarStyles();
  const {
      search,
      title,
      titleIcon,
      onSearchEnter,
  } = props;

  const [displayedSearch, setDisplayedSearch] = useState('');

  return (
    <div>
    <Toolbar className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify='space-between' alignItems='center' wrap='wrap' spacing={2}>
            
            {/* Title */}
            <Grid item xs={12} >
              <Grid container justify='flex-start' alignItems='center' wrap='nowrap' spacing={2}>
                {(titleIcon !== undefined && titleIcon === 1) && (
                  <Grid item>
                    <AssociatedList fontSize="small" />
                  </Grid>
                )}
                {(titleIcon !== undefined && titleIcon === 2) && (
                  <Grid item>
                    <DeleteList fontSize="small" />
                  </Grid>
                )}
                
                <Grid item>
                  <Typography className={classes.title} variant="h6">
                    {title}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* SearchField + Actions */}
            <Grid item xs={12}>
              <Grid container justify='flex-end' alignItems='center' wrap='nowrap'>
                <Grid item>
                  {/* Search field */}
                  <TextField
                    id="search-field"
                    value={displayedSearch}
                    placeholder="Search"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Search">
                            <Search color="inherit" fontSize="small" />
                          </Tooltip>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Clear search">
                            <span>
                              {(!search) && (
                                <IconButton
                                  disabled={true}
                                >
                                  <ClearInactive color="inherit" fontSize="small" />
                                </IconButton>
                              )}
                              {(search) && (
                                <IconButton
                                  onClick={() => {
                                    onSearchEnter('');
                                    setDisplayedSearch('');
                                  }}
                                >
                                  <ClearActive color="secondary" fontSize="small" />
                                </IconButton>
                              )}
                            </span>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        console.log('Enter key pressed, value: ', displayedSearch);
                        onSearchEnter(displayedSearch);
                      }
                    }}
                    onChange={event => setDisplayedSearch(event.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Headers */}
            <Grid item xs={12} className={classes.headers}>
              <Grid container justify='flex-start' alignItems='center' wrap='nowrap'>

                {/* Id */}
                <Grid item xs={1}>
                  <Typography className={classes.id} variant="caption" display="block" noWrap={true}><b>id</b></Typography>
                </Grid>
                
                {/* Label */}
                <Grid item xs={9}>
                  <Typography className={classes.label} variant="caption" display="block" noWrap={true}><b>&nbsp;&nbsp;&nbsp;name</b></Typography>
                </Grid>
              
              </Grid>
            </Grid>

            <Grid container justify='center' alignItems='center' wrap='wrap'>
              <Grid item xs={12}>
              {/* Divider */}
              <Divider orientation="horizontal" />
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
    </div>
  );
};
RolesToRemoveTransferViewToolbar.propTypes = {
    search: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleIcon: PropTypes.number,
    onSearchEnter: PropTypes.func.isRequired,
};
