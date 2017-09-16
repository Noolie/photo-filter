import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroupd from 'react-addons-css-transition-group';

var filters = [
  {
    key: 0.01,
    name: 'red',
    type: 'color',
    initValue: 0,
    minValue: 0,
    maxValue: 255
  },
  {
    key: 0.02,
    name: 'green',
    type: 'color',
    initValue: 0,
    minValue: 0,
    maxValue: 255
  },
  {
    key: 0.03,
    name: 'blue',
    type: 'color',
    initValue: 0,
    minValue: 0,
    maxValue: 255
  },
  {
    key: 0.04,
    name: 'rgbOpacity',
    type: 'color-opacity',
    initValue: 0.8,
    minValue: 0,
    maxValue: 1
  },
  {
    key: 0.1,
    name: 'brightness',
    type: 'percentage',
    initValue: 100,
    minValue: 0,
    maxValue: 200
  },
  {
    key: 0.2,
    name: 'contrast',
    type: 'percentage',
    initValue: 100,
    minValue: 0,
    maxValue: 200
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
    maxValue: 200
  },
  {
    key: 0.7,
    name: 'sepia',
    type: 'percentage',
    initValue: 0,
    minValue: 0,
    maxValue: 100
  },
]

class Filter extends React.Component {
  constructor(){
    super();
    this.state = {
      filters: filters,
      isNotification: true,
      error: '',
      currentImage: 'init-image.jpg',
      currentImageAlt: 'init image',
      renderedImage: 'init-image.jpg'
    }
  }
  fileSelect(ev){
    /*function to get an image from computer, save to memory and transfer into link*/
    let addedFile = ev.target.files[0];
    /*(if state) to block all files except image and in case send and error massage*/
    let reader = new FileReader();
    reader.onload = ((currentFile) => {
      return (ev) => {
        if(!addedFile.type.match('image.*')){
          this.refs.addFile.value = '';
          this.setState({
            isNotification: false,
            error: 'files only with .png .jpg .jpeg endings allowed',
            currentImage: this.state.currentImage,
            currentImageAlt: this.state.currentImageAlt
          })
        } else {
          this.setState({
            filters: filters,
            isNotification: true,
            currentImage: ev.target.result,
            currentImageAlt: currentFile.name,
            renderedImage: ev.target.result
          })
        }
      }
    })(addedFile);
    reader.readAsDataURL(addedFile);
  }
  makeFilter(currentFilter, currentRef, currentType){
    return function(){
      /*creating canvas file, setting the parameters and putting 2d context*/
      let canvasFile = document.createElement('CANVAS');
      canvasFile.width = this.refs.outputImage.width;
      canvasFile.height = this.refs.outputImage.height;
      let ctx = canvasFile.getContext ? canvasFile.getContext('2d') : null;
      /*creating image and putting url of current state*/
      let img = document.createElement('img');
      img.src = this.state.currentImage;
      /*making bunch of loops to get bunch of value from the array 'filters':*/
      /*first loop is looking for filter and makes change of its value*/
      for(let i = 0; i < this.state.filters.length; i++){
        if(currentFilter == this.state.filters[i].name){
          this.state.filters[i].initValue = Number(this.refs[currentRef].value)
        }
      }
      /*second loop is taking values of colors and pushing into single array*/
      let filterHistory = [];
      for(let i = 0; i < this.state.filters.length; i++){
        if(this.state.filters[i].type != 'percentage') continue
        if(this.state.filters[i].name == currentFilter) continue
        filterHistory.push(this.state.filters[i].name + '(' + this.state.filters[i].initValue + '%)');
      }
      /*third loop is taking a filter values and pushing into single array*/
      let colorHistory = [];
      for(let i = 0; i < this.state.filters.length; i++){
        if(this.state.filters[i].type != 'color') continue
        colorHistory.push(this.state.filters[i].initValue)
      }
      /*variable 'allColors' is concatenating all colors together and makes it ready to render*/
      let allColors = 'rgba(' + colorHistory.join(',') + ',1)';
      /*this if state is pushing FRESH value of current filter since we skip it above */
      currentType == 'percentage'?filterHistory.push(currentFilter + '(' + this.refs[currentRef].value + '%)'):filterHistory.push('');
      /*here we are creating an array and making a single index with all filters as a string
      since ctx.filter is taking array only (for 2 or more filters simultaneously)*/
      let allCurrentFilters = [];
      allCurrentFilters[0] = filterHistory.join('');
      ctx.filter = allCurrentFilters;
      ctx.fillStyle = allColors;
      /*create color layer over the image*/
      ctx.fillRect(0,0,canvasFile.width,canvasFile.height);
      /*getting an opacity of this layer*/
      ctx.globalAlpha = Number(currentType == 'color-opacity'?this.refs[currentRef].value:this.refs.rgbOpacity.value);
      /*draw all the stuff together with colors and filters*/
      ctx.drawImage(img, 0, 0, canvasFile.width, canvasFile.height);
      /*and finally creating a link of our image and send it into state to show on the screen */
      this.setState({
        renderedImage: canvasFile.toDataURL(),
      })
    }
  }

  createLink(url){
    let anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.download = this.state.currentImageAlt;
    anchor.click();
    console.log('5')
  }

  getResult(ev){
    ev.preventDefault();
    ev.stopPropagation();
    let canvasFile = document.createElement('CANVAS');
    canvasFile.width = this.refs.bigSizeImage.width;
    canvasFile.height = this.refs.bigSizeImage.height;
    console.log('1')
    let ctx = canvasFile.getContext ? canvasFile.getContext('2d') : null;
    let img = document.createElement('img');
    img.src = this.state.currentImage;
    console.log('2')
    let filterHistory = [], colorHistory = [];
    for(let i = 0; i < this.state.filters.length; i++){
      if(this.state.filters[i].type != 'percentage') continue
      filterHistory.push(this.state.filters[i].name + '(' + this.state.filters[i].initValue + '%)');
    }
    for(let i = 0; i < this.state.filters.length; i++){
      if(this.state.filters[i].type != 'color') continue
      colorHistory.push(this.state.filters[i].initValue)
    }
    console.log('3')
    ctx.filter = [filterHistory.join('')];
    ctx.fillStyle = 'rgba(' + colorHistory.join(',') + ',1)';
    ctx.fillRect(0,0,canvasFile.width,canvasFile.height);
    ctx.globalAlpha = this.refs.rgbOpacity.value;
    console.log('4')
    ctx.drawImage(img, 0, 0, canvasFile.width, canvasFile.height);
    console.log('4.5')
    this.createLink(canvasFile.toDataURL());
    console.log(canvasFile.toDataURL())

  }

  render(){
    return (
      <div className='filter'>
        <div className='error-block'>
          <p className={'error-msg ' + (this.state.isNotification?'is-notification':'')}>{this.state.error}</p>
        </div>
        <div className='add-file'>
          <input type='file' ref='addFile' onChange={this.fileSelect.bind(this)} />
          <p className='dwnld-notif'>Click on IMAGE to download current image</p>
        </div>
        <div className='current-image'>
          <a ref='downloadImage' href={this.state.currentImage} onClick={this.getResult.bind(this)}>
            <img ref='bigSizeImage' className='is-visible' src={this.state.currentImage} alt={this.state.currentImageAlt}/>
            <img ref='outputImage' height='400' src={this.state.renderedImage} alt={this.state.currentImageAlt}/>
          </a>
        </div>
        <div className='controls'>
          {this.state.filters.map(item => {
            if(item.key >= 0.1){
              return (
                    <div className='single-filter' key={item.key}>
                      <input
                        ref={item.name}
                        type='range'
                        step={(item.maxValue + item.minValue) / 100}
                        min={item.minValue}
                        max={item.maxValue}
                        onChange={this.makeFilter(item.name,item.name,item.type).bind(this)}
                        value={Number(item.initValue)}
                      />
                      <p>{item.name}</p>
                      <p>{item.initValue}%</p>
                    </div>
                    )
                } else {
                return(
                    <div className='single-filter rgba' key={item.key}>
                      <input
                        ref={item.name}
                        type='range'
                        step={item.maxValue > 1 ? (item.maxValue + item.minValue) / item.MaxValue : (item.maxValue + item.minValue) / 10}
                        min={item.minValue}
                        max={item.maxValue}
                        onChange={this.makeFilter(item.name,item.name,item.type).bind(this)}
                        value={Number(item.initValue)}
                      />
                      <p>{item.name}</p>
                      <p>{item.initValue}</p>
                    </div>
                    )
                }
              })}
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Filter />
      </div>
    );
  }
}

export default App;
