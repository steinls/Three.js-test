

  THREE.drag = function (objs, camera, dom) {
    if(objs instanceof THREE.Camera){
      console.log( 'THREE.drag : Constructor now expects ( objects, camera, domElement )' );
    }

    this.objs = objs;
    this.camera = camera;
    this.dom = dom;

    this.plane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // 位移
    this.offset = new THREE.Vector3();
    // 与平面交点
    this.intersection = new THREE.Vector3();

    this.selected = null;

    // 配置
    this.enabled = true;

    this.activate = function () {
      this.dom.addEventListener('mousemove', this.mouseMove.bind(this),false);
      this.dom.addEventListener('mousedown', this.mouseDown.bind(this),false);
      this.dom.addEventListener('mouseup', this.mouseCancel.bind(this),false);
      this.dom.addEventListener('mouseleave', this.mouseCancel.bind(this),false);
    }

    this.deactivate = function () {
      this.dom.removeEventListener('mousemove', this.mouseMove);
      this.dom.removeEventListener('mousedown', this.mouseDown);
      this.dom.removeEventListener('mouseup', this.mouseCancel);
      this.dom.removeEventListener('mouseleave', this.mouseCancel);
    }

    this.mouseMove = function (e) {
      e.preventDefault();
      
      // 将鼠标位置转化为标准化设备坐标
      rect = this.dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // 如果选中物体,则计算位移
      if ( this.selected && this.enabled) {
        this.raycaster.setFromCamera( this.mouse, this.camera );
        // 是否与片面相交，将交点赋予this.intersection
        if ( this.raycaster.ray.intersectPlane( this.plane, this.intersection)) {
          // 将物体移动到射线与平面交点
          this.selected.position.copy( this.intersection.sub(this.offset));
        }
        //设置drag事件触发器
        this.dispatchEvent( { type: 'drag', object: this.selected } );
        return;
      }

      // --使用相机指向和物体位置更新平面
      this.raycaster.setFromCamera( this.mouse, this.camera );
      var intersects = this.raycaster.intersectObjects( this.objs );
      if (intersects.length) {
        var obj = intersects[0].object;
        // 获取相机指向的点
        var direction = camera.getWorldDirection(this.plane.normal);
        // 使用相机方向点和位点，更新平面
        this.plane.setFromNormalAndCoplanarPoint( direction, obj.position );
      }
    }


    this.mouseDown = function (e) {
      e.preventDefault();

      // --选取物体并计算位移距离
      this.raycaster.setFromCamera(this.mouse, this.camera);
      var intersects = this.raycaster.intersectObjects(this.objs);
      if(intersects.length){
        this.selected = intersects[0].object;
        // 将射线与平面相交的点，赋值给this.intersection
        if(this.raycaster.ray.intersectPlane(this.plane,this.intersection)){
          // 使用平面交点(this.intersection)和物体位置(position)
          // 计算出位移距离
          this.offset.copy(this.intersection).sub(this.selected.position);
        }
        //设置dragstart事件触发器
        this.dispatchEvent( { type: 'dragstart', object: this.selected } );
      }
    }


    this.mouseCancel = function (e) {
      e.preventDefault();

      if(this.selected){
        // 取消选择
        this.selected = null;

        //设置dragend事件触发器
        this.dispatchEvent( { type: 'dragend', object: this.selected } );
      }
    }

    // 初始化
    this.activate();
  }

  THREE.drag.prototype = Object.create( THREE.EventDispatcher.prototype );
  THREE.drag.prototype.constructor = THREE.drag;
