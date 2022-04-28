import React, { useState, useMemo, useRef, useEffect } from 'react'
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import  {useNavigate} from 'react-router-dom'
import axios from 'axios'
import ReactLoading from 'react-loading';
import env from 'dotenv';

function PainterSelect() {
    env.config()
    const [styles, setStyles] = useState();
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
      axios.get('https://y3lvwgziv0.execute-api.us-east-2.amazonaws.com/getArtists')
          .then((res) => {
            console.log(res.data)
            var artists = []
            for(var i = 0 ; i < res.data.length; i++){
              artists.push({label: res.data[i][0], index: res.data[i][1]})
              setStyles(artists)
            }
            console.log(styles);
            setLoading(false);
          })


    }, []);
    const navigate = useNavigate();
    const Example = ({ type, color }) => (
      <ReactLoading type={'bars'} color={'#ffffff'} height={667} width={375} />
    );

    if (isLoading) {
      return (<Example />)
    }

    const onChange = (value) => {

      localStorage.setItem('style', value.index);
      localStorage.setItem('name', value.label);
      navigate('/generated');
    }

    return (
      <div className="container">

        <div className="row">
          <div className="col-md-13">
          <h1> Welcome to painter! </h1>
          <br></br>
            <Select options={styles} onChange ={onChange} placeholder="Select your style"/>
            <br></br>
          </div>
        </div>
      </div>
    );

}

export default PainterSelect