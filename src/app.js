var HelloWorldLayer = cc.Layer.extend({
    sprFondo:null,
    sprConejo:null,
    moveLeft:null,
    moveRight:null,
    size:null,
    zanahoria:[],
    bombas:[],
    hearts:[],
    idHearts:null,
    score:null,
    fin:false,
    
    random: function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    
    lloverZanahoria : function(){
        var step = this.size.width/10;
        var zanahoriaTemp = new cc.Sprite(res.zanahoria_png);
        var rnd = this.random(this.size.width/2 - 2*step, this.size.width/2 + 2*step);
        zanahoriaTemp.setPosition(rnd, this.size.height);
        this.addChild(zanahoriaTemp, 2);
        var time = 5;
        var num = parseInt(this.score.string);
        if(num >= 30) time = 4;
        if(num >= 50) time = 3;
        if(num >= 70) time = 2;
        if(num >= 95) time = 1;
        zanahoriaTemp.runAction( cc.moveTo(time, zanahoriaTemp.getPositionX(), -100) );
		this.zanahoria.push(zanahoriaTemp);
        
    },
    
    lloverBomba : function(){
        var step = this.size.width/10;
        var bombaTemp = new cc.Sprite(res.bomba_png);
        var rnd = this.random(this.size.width/2 - 2*step, this.size.width/2 + 2*step);
        bombaTemp.setPosition(rnd, this.size.height);
        this.addChild(bombaTemp, 2);
        bombaTemp.runAction( cc.moveTo(this.random(1,10), bombaTemp.getPositionX(), -100) );
		this.bombas.push(bombaTemp);
        
    },
    
    mover : function(key, event) {
        var juego = event.getCurrentTarget();
        var step = juego.size.width/20;
        var middle = juego.size.width/2;
        switch(key) {
            case 37:
                if(juego.sprConejo.x - step >= middle - 4*step) juego.sprConejo.x -= step;    
                break;
            case 39:
                if(juego.sprConejo.x + step <= middle + 4*step) juego.sprConejo.x += step;
                break;
        }
    },
    
    restore : function() 
    {
        var curScene = cc.director.getRunningScene();
        var allChildren = curScene.getChildren();
        allChildren[0].sprConejo.initWithFile(res.conejo_png);
        cc.director.resume();
    },
    
    checkCollision : function(){
        for(var i=0; i<this.zanahoria.length; i++){
            if(Math.abs(this.zanahoria[i].getPositionX()-this.sprConejo.getPositionX())<=(this.zanahoria[i].width+this.sprConejo.width)/3  &&
              Math.abs(this.zanahoria[i].getPositionY()-this.sprConejo.getPositionY())<=(this.zanahoria[i].height+this.sprConejo.height)/2 &&
              this.zanahoria[i].isVisible()){
                this.zanahoria[i].setVisible(false);
                var num = parseInt(this.score.string);
                num++;
                this.score.string = num;
            }
        }
        for(var i=0; i<this.bombas.length; i++){
            if(Math.abs(this.bombas[i].getPositionX()-this.sprConejo.getPositionX())<=(this.bombas[i].width+this.sprConejo.width)/3  &&
              Math.abs(this.bombas[i].getPositionY()-this.sprConejo.getPositionY())<=(this.bombas[i].height+this.sprConejo.height)/3 &&
              this.bombas[i].isVisible()){
                this.hearts[this.idHearts].setVisible(false);
                this.bombas[i].setVisible(false);
                this.idHearts--;
                this.sprConejo.initWithFile(res.muerto_png);
                cc.director.pause();
                setTimeout(this.restore, 200);
            }
        }
    },
    
    endGame : function(){
        if(this.idHearts < 0){
            cc.LoaderScene.preload(g_resources, function () {
                cc.director.runScene(new HelloWorldScene());
            }, this);
            cc.game.run();
        }
        
    },
    
    ctor:function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        this.size = cc.winSize;
        
        //posicionando la imagen de fondo
        this.sprFondo = new cc.Sprite(res.fondo_png);
        this.sprFondo.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(this.sprFondo, 0);
        
        //posicionando la imagen de fondo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setPosition(this.size.width / 2,this.size.height * 0.15);
        this.addChild(this.sprConejo, 1);
        
        //posicionando corazones
        this.idHearts = 4;
        var step = this.size.width/20;
        for(var i=0; i<5; i++){
            var temp = new cc.Sprite(res.vida_png);
            temp.setPosition(this.size.width/2 + (4-i)*step, this.size.height - this.size.height/15);
            temp.setScale(0.5, 0.5);
            this.hearts[i] = temp;
            this.addChild(temp);
        }
        
        //posicionando score
        this.score = new cc.LabelTTF("0", "Arial", 24);
        this.score.setPosition( (this.size.width/2)+(this.size.width/5), this.size.height/15);
        this.addChild(this.score, 5);
        
        this.schedule(this.lloverZanahoria,3);
        this.schedule(this.lloverBomba,10);
        this.schedule(this.checkCollision,0.2);
        this.schedule(this.endGame,0.15);
            
        cc.eventManager.addListener(
        {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.mover
        }, this);
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

