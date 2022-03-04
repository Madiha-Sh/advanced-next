import { GetServerSideProps } from "next";
import { getMakes, Make } from '../database/getMakes';
import { getModels, Model } from '../database/getModels';
import getAsString from '../getAsString';
import { FormControl,  Grid, InputLabel, MenuItem, Paper, Select, SelectProps } from '@mui/material';
import { Field, Form, Formik, useField, useFormikContext } from 'formik';
import { makeStyles } from '@mui/styles';
import router, { useRouter } from "next/router";
import useSWR from "swr"; 
import { Button } from "@material-ui/core";

export interface HomeProps { 
  makes: Make[];
  models: Model[];
  singleColumn? :boolean;
}   

const useStyles = makeStyles({
  paper: {
    margin: '30px auto',
    maxWidth: 500,
    padding: '30px 20px'
  },
  flex: {
    display: 'flex'
  }
}); 

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];

export default function Search({ makes, models, singleColumn }: HomeProps) {
  const classes = useStyles();
  const { query } = useRouter();
  const smValue = singleColumn ? 12 : 6;
  
  const initialValues = {
    make: getAsString(query.make) || 'all',
    model: getAsString(query.model) || 'all',
    min: getAsString(query.min) || 'none',
    max: getAsString(query.max) || 'none',
  } 
 
  return (  
    <Formik initialValues={initialValues} onSubmit={(values) => {
      router.push({
        pathname: '/cars',
        query: {...values, page: 1}
      }, undefined, { shallow: true })
    }}>
      {({ values }) => (  
        <Form> 
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Make</InputLabel> 
                  <Field 
                    name="make" 
                    as={Select}   
                    labelId="search-make"   
                    label="Make"  
                  > 
                    <MenuItem value="all" style={{display: 'flex'}}>
                      <em>All Makes</em>  
                    </MenuItem>
                    {makes.map(make => (
                      <MenuItem key={make.make} value={make.make} style={{display: 'flex'}}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <ModelSelect make={values.make} name='model' models={models}/>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-min-price">Min Price</InputLabel>
                  <Field
                    name="min"
                    as={Select} 
                    labelId="search-min-price"
                    label="Min Price"
                  >
                    <MenuItem value="none" style={{display: 'flex'}}>
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map(price => (
                      <MenuItem key={price} value={price} style={{display: 'flex'}}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>  
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-max-price">Max Price</InputLabel>
                  <Field
                    name="max"
                    as={Select}
                    labelId="search-max-price"
                    label="Max Price"
                  >
                    <MenuItem value="none" style={{display: 'flex'}}>
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map(price => (
                      <MenuItem key={price} value={price} style={{display: 'flex'}}>
                        {price}
                      </MenuItem> 
                    ))}    
                  </Field> 
                </FormControl> 
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant='contained' fullWidth color="primary">search</Button>
              </Grid>
            </Grid>
          </Paper> 
        </Form> 
      )}
    </Formik>  
  );
}
 
export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({models, make, ...props}: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({
    name: props.name
  });  

  const { data } = useSWR<Model[]>('/api/models?make=' + make, {
    dedupingInterval: 60000,
    onSuccess: (newValues) => {
      if(!newValues.map(a => a.model).includes(field.value)) {
        // we want to make this field.value = 'all';
        setFieldValue('model', 'all')
      } 
    }
  });

  const newModels = data || models; 

  return <FormControl fullWidth variant="outlined">
    <InputLabel id="search-model">Model</InputLabel>
    <Select 
      name="model"
      labelId="search-model"  
      label="Model"   
      {...props} 
      {...field}      
    > 
      <MenuItem value="all" style={{display: 'flex'}}>
        <em>All Model</em> 
      </MenuItem>
      {newModels.map(model => (
        <MenuItem key={model.model} value={model.model} style={{display: 'flex'}}>
          {`${model.model} (${model.count})`}
        </MenuItem>
      ))} 
    </Select>
  </FormControl>
}
 
export const getServerSideProps: GetServerSideProps = async (context) => {
  const make = getAsString(context.query.make);
  // const makes = await getMakes();
  // const models = await getModels(make);
  const [ makes, models ] = await Promise.all([getMakes(), getModels(make)]);
  return {
    props: {
      makes,
      models 
    }
  }
};