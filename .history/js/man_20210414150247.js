NSOC.napi.get('/scn/file/upload/2p1v0h1fo4jk/map_huadong.json').then(json => {
    let jsonData = json && json.features || [];

    let shapeGroup = new THREE.Group()
    shapeGroup.name = '华东地图'
    shapeGroup.rotateX(Math.PI / 2)
        // shapeGroup.position.y = 0.5

    jsonData.forEach((regin) => {
        let reginGroup = new THREE.Group()

        reginGroup.name = regin.properties.name
        regin.geometry.coordinates.forEach((geo) => {
            let geoPointArr = geo[0].map((item) => {
                return changeCoordinate(Projection(item))
            })

            let regionMesh = this._drawRegion(geoPointArr)
            let borderMesh = this._drawBorder(geoPointArr)

            reginGroup.add(regionMesh)
            reginGroup.add(borderMesh)
        })

        shapeGroup.add(reginGroup)
    })

    shapeGroup.visible = false;

    ShareData.huadongMapGroup = shapeGroup;
    console.log(shapeGroup)

    this.player.scene.add(shapeGroup);
    // console.log('华东地图加载完毕');

    resolve(this.player)
})