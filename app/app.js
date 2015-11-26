import Dat from 'dat-gui';
import Scene from './scene/scene';
import { Sprite, Graphics } from 'pixi.js';
import NumberUtils from './utils/number-utils';
import Data from './lib/data';
import emitter from './lib/event-emitter';
import Tree from './lib/tree';
import Pollution from './lib/pollution';
import $ from 'jquery';

let angle = 0;


class App {

  constructor() {

    $('#arrow').click(function(){
      $('#overlayer').css({
       transform: 'translateY(-100%) ',
       MozTransform: 'translateY(-100%)',
       WebkitTransform: 'translateY(-100%) ',
       msTransform: 'translateY(-100%)'
      });
      emitter.emit('closeHome');
    })
    emitter.on('closeHome', function(){
      this.animateMap();
    }.bind(this));
    

    this.DELTA_TIME = 0;
    this.LAST_TIME = Date.now();

    this.width = window.innerWidth/2;
    this.height = window.innerHeight/2;
    let sceneOptions = {
      width: 800,
      height:645
    }
    this.scene = new Scene(sceneOptions);
    let scene =  this.scene;
    let root = document.body.querySelector('.app')
    root.appendChild( this.scene.renderer.view );

    this.options = {
      width : this.width,
      height : this.height
    }

    this.trees = [];

    this.data = new Data(this.options);

      emitter.on('dataLoaded', function(){
        var coords = this.data.coordsXY;

        for ( var i = 0; i < coords.length; i++){
          let options = {
            x : coords[i].x*0.65,
            y : coords[i].y*1.1,
            size : this.data.surfaces[i],
            content : this.data.contents[i]
          };
          this.tree = new Tree(options);
          this.trees.push(this.tree);
          scene.addChild(this.tree);
        }
        emitter.emit('pushEnd');
      }.bind(this));
    
      
    this.pollution = new Pollution(scene);

    $('.pictos').click(function(){
       $(this).toggleClass('active');
    }); 

    this.pollutionName = [
      '#voiture',
      '#chauffage',
      '#usine',
      '#transport',
      '#agriculture'
    ];

    this.pollutionArr = [
      this.pollution.voiture,
      this.pollution.chauffage,
      this.pollution.usine,
      this.pollution.transport,
      this.pollution.agriculture
    ];

    this.pollutionNb = [
      56,
      18,
      15,
      7,
      3
    ];

    this.pollutionAlpha = [
      0.3,
      0.45,
      0.6,
      0.75,
      0.9
    ];


    $('.pictos').click(function(){
      for(let i = 0; i < this.pollutionArr.length; i++){
         if( $(this.pollutionName[i]).hasClass('active')){
            this.pollution.throw1(this.pollutionNb[i], this.pollutionAlpha[i],this.pollutionArr[i]);
          }else{
            this.pollution.clear(this.pollutionArr[i]);
          };
        }
        

    }.bind(this)); 
    

    this.addListeners();

    

  }

  /**
   * addListeners
   */
  addListeners() {

    window.addEventListener( 'resize', this.onResize.bind(this) );
    TweenMax.ticker.addEventListener( 'tick', this.update.bind(this) );
  }

  /**
   * update
   * - Triggered on every TweenMax tick
   */
  update() {
    this.DELTA_TIME = Date.now() - this.LAST_TIME;
      this.LAST_TIME = Date.now();
    // emitter.on('pushEnd', function(){
      for(let i = 0; i < this.pollutionArr.length; i++){
        this.pollution.update(this.DELTA_TIME, this.pollutionArr[i]);
      }
      
      // console.log(this.trees);

      // for (let i = 0; i < this.trees.length; i++){
      //   this.trees[i].update(this.DELTA_TIME);
      // }
    // }.bind(this));
    this.scene.render();

  }

  /**
   * onResize
   * - Triggered when window is resized
   * @param  {obj} evt
   */
  onResize( evt ) {

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene.resize( this.width, this.height );


  }

  animateMap(){
    let el = document.getElementById('map');
    TweenMax.staggerFrom(".ardt", 0.5,{opacity: 0, scale: 1.5, rotation:45, delay: 0.5}, 0.05);
    TweenMax.from(".river", 0.5,{opacity: 0, scale: 1.5, rotation:45, delay: 1.55});
  }



}

export default App;
