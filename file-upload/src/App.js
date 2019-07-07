import React, { Component } from 'react';
import axios from 'axios';
import { Progress } from 'reactstrap';

export default class App extends Component {

  state = {
    selectedFile: null,
    loaded: 0
  }

  onChangeHandler = e => {
    this.setState({
      selectedFile: e.target.files[0],
      loaded: 0
    })
  }

  onclickHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.state.selectedFile)

    axios.post('http://localhost:8000/upload', data,{
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
        })
      }
    })
    .then(res => {
      console.log('from react post call', res.statusText);
    })
  }

  render() {
    return(
      <div className='container'>
        <div className='row'>
          <div className='offset-md-3 col-md-6'>
            <div className='form-group files'>
              <label>Upload Your File</label>
              <input type='file' name='file' className='form-control' onChange={this.onChangeHandler} />
            </div>
            <div className="form-group">
              <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
            </div>
            <button type='button' className='btn btn-success btn-lg btn-block' onClick={this.onclickHandler}>Upload</button>
          </div>
        </div>
      </div>
    )
  }
}
