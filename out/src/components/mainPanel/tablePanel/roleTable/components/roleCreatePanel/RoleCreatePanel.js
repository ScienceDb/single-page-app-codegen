import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import RoleAttributesPage from './components/roleAttributesPage/RoleAttributesPage'
import RoleAssociationsPage from './components/roleAssociationsPage/RoleAssociationsPage'
import RoleTabsA from './components/RoleTabsA'
import RoleConfirmationDialog from './components/RoleConfirmationDialog'
import api from '../../../../../../../requests/index'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    minWidth: 450,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  tabsA: {
    backgroundColor: "#fafafa",
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: -26+3,
    right: 10,
    margin: '0 auto',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RoleCreatePanel(props) {
  const classes = useStyles();
  const { 
    handleClose,
    handleOk,
  } = props;

  const [open, setOpen] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');

  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);
  const usersIdsToAdd = useRef([]);
  const values = useRef(getInitialValues());

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);

  function getInitialValues() {
    let initialValues = {};
    
    initialValues.name = '';
    initialValues.description = '';

    return initialValues;
  }

  function getInitialValueOkStates() {
    let initialValueOkStates = [];

    initialValueOkStates.push({ key: 'name', valueOk:0 });
    initialValueOkStates.push({ key: 'description', valueOk:0 });

    return initialValueOkStates;
  }

  function itemHasKey(item, index) {
    if(item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
    }
  }

  function getAcceptableStatus(key, value) {
    /*
      For now, just context validations are done
      to ensure that in future, this function can
      be used to enforce acceptable conditions
      retrieved from model specs.

      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
      -1: not acceptable 
    */

    /*
      Check 1: null or undefined value
    */
    if(value === null || value === undefined) {
      return -1;
    }

    /*
      Check 2 (last): empty
    */
    if(typeof value === 'string' && value.trim() === '') {
      return 0;
    }

    return 1;
  }

  function areThereAcceptableFields() {
    for(var i=0; i<valueOkStates.length; ++i) {
      if(valueOkStates[i].valueOk === 1) {
        return true;
      }
    }
    return false;
  }

  function areThereNotAcceptableFields() {
    for(var i=0; i<valueOkStates.length; ++i) {
      if(valueOkStates[i].valueOk === -1) {
        return true;
      }
    }
    return false;
  }

  function areThereIncompleteFields() {
    for(var i=0; i<valueOkStates.length; ++i) {
      if(valueOkStates[i].valueOk === 0) {
        return true;
      }
    }
    return false;
  }

  function doSave(event) {
    //add ids
    values.current.addUsers = usersIdsToAdd.current;

    /*
      API Request: createItem
    */
    api.role.createItem(graphqlServerUrl, values.current)
      .then(response => {
        //Check response
        if (
          response.data &&
          response.data.data
        ) {
          /**
            * Debug
            */
          console.log(">> mutation.add response: ", response.data.data);

          handleOk();
          return;

        } else {

          //error
          console.log("error3")

          //done
          return;
        }
      })
      .catch(err => {

        //error
        console.log("error4: ", err)

        //done
        return;
      });
    
    //close
    onClose(event);
  }

  const handleTabsChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  const handleFieldChange = (event, value, key) => {
    //set new value
    values.current[key] = value;
   
    //reset ok status if needed
    let o = {key: key, valueOk: 0};
    let i = -1;
    if(valueOkStates.length > 0) {
      i = valueOkStates.findIndex(itemHasKey, {key:key});
    }
    if(i !== -1) {
      if(valueOkStates[i].valueOk !== 0) {
        let newValueOkStates = Array.from(valueOkStates);
        newValueOkStates[i] = o;
        setValueOkStates(newValueOkStates);
      }
    }
  }

  const handleOkStateUpdate = (value, key) => {
    let o = {key: key, valueOk: getAcceptableStatus(key, value)};
    let i = -1;
    if(valueOkStates.length > 0) {
      i = valueOkStates.findIndex(itemHasKey, {key:key});
    }
    if(i !== -1) {
      let newValueOkStates = Array.from(valueOkStates);
      newValueOkStates[i] = o;
      setValueOkStates(newValueOkStates);
    }
  }

  const handleSave = (event) => {
    if(areThereNotAcceptableFields()) {
      setConfirmationTitle("Some fields are not valid");
      setConfirmationText("To continue, please validate these fields.")
      setConfirmationAcceptText("I UNDERSTAND");
      setConfirmationRejectText("");
      handleAccept.current = () => {
        setConfirmationOpen(false);
      }
      handleReject.current = undefined;
      setConfirmationOpen(true);
      return;
  }

    if(areThereIncompleteFields()) {
      setConfirmationTitle("Some fields are empty");
      setConfirmationText("Do you want to continue anyway?")
      setConfirmationAcceptText("YES, SAVE");
      setConfirmationRejectText("DON'T SAVE YET");
      handleAccept.current = () => {
        doSave(event);
        setConfirmationOpen(false);
      }
      handleReject.current = () => {
        setConfirmationOpen(false);
      }
      setConfirmationOpen(true);
    } else {
      doSave(event);
    }
  }

  const handleCancel = (event) => {
    if(areThereAcceptableFields()) {
      setConfirmationTitle("The edited information has not been saved");
      setConfirmationText("Some fields have been edited, if you continue without save, the changes will be lost, you want to continue?")
      setConfirmationAcceptText("YES, EXIT");
      setConfirmationRejectText("STAY");
      handleAccept.current = () => {
        setConfirmationOpen(false);
        onClose(event);
      }
      handleReject.current = () => {
        setConfirmationOpen(false);
      }
        setConfirmationOpen(true);
        return;
    } else {
      onClose(event);
    }
  }

  const onClose = (event) => {
    setOpen(false);
    handleClose(event);
  }

  const handleConfirmationAccept = (event) => {
    handleAccept.current();
  }

  const handleConfirmationReject = (event) => {
    handleReject.current();
  }
  
  const handleTransferToAdd = (associationKey, itemId) => {
    switch(associationKey) {
      case 'user':
        usersIdsToAdd.current.push(itemId);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'user') {
      for(var i=0; i<rolesIdsToAdd.current.length; ++i)
      {
        if(usersIdsToAdd.current[i] === itemId) {
          usersIdsToAdd.current.splice(i, 1);
          return;
        }
      }
      return;
    }//end: case 'user'
  }

  return (
    
    <Dialog fullScreen open={open} onClose={handleCancel} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Tooltip title={"Cancel"}>
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={handleCancel}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title}>
            {'New Role'}
          </Typography>
          <Tooltip title={"Save role"}>
            <Fab 
              color="secondary" 
              className={classes.fabButton}
              onClick={handleSave}
            >
              <SaveIcon />
            </Fab>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <div className={classes.root}>
        <Grid container justify='center'>
          <Grid item xs={12}>
            
            {/* TabsA: Menú */}
            <div className={classes.tabsA}>
            <RoleTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
              handleCancel={handleCancel}
              handleSave={handleSave}
            />
            </div>
              
            {/* Attributes Page [0] */}
            <RoleAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              handleFieldChange={handleFieldChange}
              handleOkStateUpdate={handleOkStateUpdate}
            />

            {/* Associations Page [1] */}
            <RoleAssociationsPage
              hidden={tabsValue !== 1}
              usersIdsToAdd={usersIdsToAdd.current}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
            />

          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <RoleConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />
      </div>

    </Dialog>
  );
}
RoleCreatePanel.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
};