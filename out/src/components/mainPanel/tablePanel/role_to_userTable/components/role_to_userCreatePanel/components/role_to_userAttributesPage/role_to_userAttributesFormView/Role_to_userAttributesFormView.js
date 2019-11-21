<script>
import React from 'react';
import PropTypes from 'prop-types';
import StringField from './components/StringField'
import FloatField from './components/FloatField'
import IntField from './components/IntField'
import BoolField from './components/BoolField'
import DateField from './components/DateField'
import TimeField from './components/TimeField'
import DateTimeField from './components/DateTimeField'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(1),
    maxHeight: '77vh',
    overflow: 'auto',
  },
  cardContent: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    minWidth: 200,
  },
}));

export default function Role_to_userAttributesFormView(props) {
  const classes = useStyles();
  const { valueOkStates, 
          handleBlur, 
          handleFieldReady, 
          handleChange,
          handleKeyDown,
        } = props;

  function itemHasKey(item, index) {
    if (item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
    }
  }

  function getItemsOk() {
    let countOk=0;
    if(valueOkStates.length > 0) {
      for(var i=0; i<valueOkStates.length; ++i)
      {
        if(valueOkStates[i].valueOk === 1) {
          countOk++;
        }
      }
    }
    return countOk;
  }

  function getValueOkStatus(key) {
    let it = undefined;

    //find index
    if(valueOkStates.length > 0) {
      it = valueOkStates.find(itemHasKey, {key:key});
    }
    //return status
    if(it !== undefined) {
      return it.valueOk;
    } else {
      return 0;
    }
  }

  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <Card className={classes.card}>

            {/* Header */}
            <CardHeader
              avatar={
                <Attributes color="primary" fontSize="small" />
              }
              title={
                <Typography variant="h6">
                  Role_to_user attributes
                </Typography>
              }
              subheader={getItemsOk()+' / 2 completed'}
            >
            </CardHeader>
            
            {/* 
              Fields 
            */}

            {/* UserId */}
            <CardContent key='userId' className={classes.cardContent} >
              <IntField
                itemKey='userId'
                name='userId'
                label='UserId'
                valueOk={getValueOkStatus('userId')}
                autoFocus={true}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* RoleId */}
            <CardContent key='roleId' className={classes.cardContent} >
              <IntField
                itemKey='roleId'
                name='roleId'
                label='RoleId'
                valueOk={getValueOkStatus('roleId')}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
Role_to_userAttributesFormView.propTypes = {
  valueOkStates: PropTypes.array.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleFieldReady: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
};