import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroupd from 'react-addons-css-transition-group';

var filters = [
{
    key: 0.1,
    name: 'brightness',
    type: 'percentage',
    initValue: 100,
    minValue: 0,
    maxValue: 100
  },
{
    key: 0.2,
    name: 'contrast',
    type: 'percentage',
    initValue: 100,
    minValue: 0,
    maxValue: 100
  },
{
    key: 0.3,
    name: 'grayscale',
    type: 'percentage',
    initValue: 0,
    minValue: 0,
    maxValue: 100
  },
{
    key: 0.4,
    name: 'invert',
    type: 'percentage',
    initValue: 0,
    minValue: 0,
    maxValue: 100
  },
{
    key: 0.5,
    name: 'opacity',
    type: 'percentage',
    initValue: 100,
    minValue: 0,
    maxValue: 100
  },
{
    key: 0.6,
    name: 'saturate',
    type: 'percentage',
    initValue: 100,
    minValue: 0,
    maxValue: 100
  },
{
    key: 0.7,
    name: 'sepia',
    type: 'percentage',
    initValue: 0,
    minValue: 0,
    maxValue: 100
  }
]

class Add extends React.Component {
  constructor(){
    super();
    this.state = {
      filters: filters,
      isImage: true,
      currentImage: 'init-image.jpg',
      currentImageAlt: 'init image',
      renderedImage: 'init-image.jpg'
    }
  }

  fileSelect(ev){
    let addedFile = ev.target.files[0];

    let reader = new FileReader();
    reader.onload = ((currentFile) => {
      return (ev) => {
        if(!addedFile.type.match('image.*')){
          this.refs.addFile.value = '';
          this.setState({
            isImage: !this.state.isImage,
            currentImage: this.state.currentImage,
            currentImageAlt: this.state.currentImageAlt
          })
        } else {
          this.setState({
            isImage: true,
            currentImage: ev.target.result,
            currentImageAlt: currentFile.name,
            renderedImage: ev.target.result
          })
        }
      }
    })(addedFile);
    reader.readAsDataURL(addedFile);
  }
  makeFilter(currentFilter, currentRef){
    return function(ev){
      let canvasFile = document.createElement('CANVAS');
      canvasFile.width = this.refs.outputImage.width;
      canvasFile.height = this.refs.outputImage.height;
      let img = document.createElement('img');
      let ctx = canvasFile.getContext ? canvasFile.getContext('2d') : null;
      for(let i = 0; i < this.state.filters.length; i++){
        if(currentFilter == this.state.filters[i].name){
          this.state.filters[i].initValue = this.refs[currentRef].value
        }
      }
      for(let i = 0; i < this.state.filters.length; i++){
        ctx.filter = this.state.filters[i].name + '(' + this.state.filters[i].initValue + '%)';
        console.log(ctx.filter)
      }
      ctx.filter = currentFilter + '(' + this.refs[currentRef].value + '%)';
      img.src = this.state.currentImage;
      ctx.drawImage(img, 0, 0, canvasFile.width, canvasFile.height);
      this.setState({
        renderedImage: canvasFile.toDataURL(),
      })
    }
  }

  render(){
    return (
      <div className='filter'>
        <div className='add-file'>
          <input type='file' ref='addFile' onChange={this.fileSelect.bind(this)} />
          <p className={'error-msg ' + (this.state.isImage?'is-image':'')}>add IMAGE file, please</p>
          <p className='dwnld-notif'>Click on IMAGE to download current image</p>
        </div>
        <div className='current-image'>
          <a href={this.state.renderedImage} download={'filtered-image-' + (Math.round(Math.random() * 1000))}>
            <img ref='outputImage' src={this.state.renderedImage} alt={this.state.currentImageAlt}/>
          </a>
        </div>
        <div className='controls'>
          {this.state.filters.map(item => (
            <div className='single-filter' key={item.key}>
              <input
                ref={item.name}
                type='range'
                step={(item.maxValue + item.minValue) / 5}
                min={item.minValue}
                max={item.maxValue}
                onChange={this.makeFilter(item.name,item.name).bind(this)}
                value={Number(item.initValue)}
              />
              <p>{item.name}</p>
            </div>))}
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Add />
      </div>
    );
  }
}

export default App;
