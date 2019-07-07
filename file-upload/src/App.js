import React, { Component } from 'react';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  onClickHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.state.selectedFile)

    axios.post('http://localhost:8000/upload', data,{
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
        })
      }
    })
    .then(res => {
      toast.success('upload success');
    })
    .catch(err => {
      toast.error('upload fail');
    })
  }

  render() {
    return(
      <div className='container'>
        <div className='row'>
          <div className='offset-md-3 col-md-6'>
            <form onSubmit={this.onClickHandler}>
              <div className="form-group">
                <ToastContainer position="top-center" />
              </div>
              <div className='form-group files'>
                <label>Upload Your File</label>
                <input type='file' name='file' className='form-control' onChange={this.onChangeHandler} />
              </div>
              <div className="form-group">
                <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
              </div>
              <button className='btn btn-success btn-lg btn-block'>Upload</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
