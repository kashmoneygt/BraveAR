/// <reference types="@argonjs/argon" />
/// <reference types="three" />
// grab some handles on APIs we use
var Cesium = Argon.Cesium;
var Cartesian3 = Argon.Cesium.Cartesian3;
var ReferenceFrame = Argon.Cesium.ReferenceFrame;
var JulianDate = Argon.Cesium.JulianDate;
var CesiumMath = Argon.Cesium.CesiumMath;
// set up Argon
var app = Argon.init();
//app.view.element.style.zIndex = 0;
// this app uses geoposed content, so subscribe to geolocation updates
app.context.subscribeGeolocation({ enableHighAccuracy: true });
// set up THREE.  Create a scene, a perspective camera and an object
// for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var stage = new THREE.Object3D;
var user = new THREE.Object3D;
scene.add(camera);
scene.add(stage);
scene.add(user);
// The CSS3DArgonRenderer supports mono and stereo views.  Currently
// not using it in this example, but left it in the code in case we
// want to add an HTML element near either geo object.
// The CSS3DArgonHUD is a place to put things that appear
// fixed to the screen (heads-up-display).
// In this demo, we are  rendering the 3D graphics with WebGL,
// using the standard WebGLRenderer, and using the CSS3DArgonHUD
// to manage the 2D display fixed content
var cssRenderer = new THREE.CSS3DArgonRenderer();
var hud = new THREE.CSS3DArgonHUD();
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true,
    antialias: Argon.suggestedWebGLContextAntialiasAttribute
});
renderer.setPixelRatio(window.devicePixelRatio);
// Set the layers that should be rendered in our view. The order of sibling elements
// determines which content is in front (top->bottom = back->front)
app.view.setLayers([
    { source: renderer.domElement },
    { source: cssRenderer.domElement },
    { source: hud.domElement },
]);
// We put some elements in the index.html, for convenience.
// Here, we retrieve the hud element and use hud.appendChild to append it and a clone
// to the two CSS3DArgonHUD hudElements.  We are retrieve the two
// elements with the 'location' class so we can update them both.
var hudContent = document.getElementById('hud');
hud.appendChild(hudContent);
var locationElements = hud.domElement.getElementsByClassName('location');
//  We also move the description box to the left Argon HUD.
// We don't duplicated it because we only use it in mono mode
var holder = document.createElement('div');
var hudDescription = document.getElementById('description');
holder.appendChild(hudDescription);
hudContent.appendChild(holder);
// Tell argon what local coordinate system you want.  The default coordinate
// frame used by Argon is Cesium's FIXED frame, which is centered at the center
// of the earth and oriented with the earth's axes.
// The FIXED frame is inconvenient for a number of reasons: the numbers used are
// large and cause issues with rendering, and the orientation of the user's "local
// view of the world" is different that the FIXED orientation (my perception of "up"
// does not correspond to one of the FIXED axes).
// Therefore, Argon uses a local coordinate frame that sits on a plane tangent to
// the earth near the user's current location.  This frame automatically changes if the
// user moves more than a few kilometers.
// The EUS frame cooresponds to the typical 3D computer graphics coordinate frame, so we use
// that here.  The other option Argon supports is localOriginEastNorthUp, which is
// more similar to what is used in the geospatial industry
app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);
// All geospatial objects need to have an Object3D linked to a Cesium Entity.
// We need to do this because Argon needs a mapping between Entities and Object3Ds.
//
// Here we create two objects, showing two slightly different approaches.
//
// First, we position a cube near Georgia Tech using a known LLA.
//
// Second, we will position a cube near our starting location.  This geolocated object starts without a
// location, until our reality is set and we know the location.  Each time the reality changes, we update
// the cube position.
// create a 100m cube with a Buzz texture on it, that we will attach to a geospatial object at Georgia Tech

// bases = [
//   // GLC
//   Cartesian3.fromDegrees(-84.39662463963032, 33.781942974496715, 275),
//   Cartesian3.fromDegrees(-84.39676277339458, 33.78193628646397, 276)
// ];
//
// baseGeoTargets = [];
// baseGeoEntities = [];
// baseObjects = [];
//
// for (var i = 0; i < bases.length; i++) {
//   var base = new THREE.Object3D;
//   var loader = new THREE.TextureLoader();
//   loader.load('images/braves_logo.png', function (texture) {
//       //var geometry = new THREE.BoxGeometry(10, 10, 10);
//       var geometry = new THREE.BoxGeometry(10, 10, 10);
//       var material = new THREE.MeshBasicMaterial({ map: texture });
//       var mesh = new THREE.Mesh(geometry, material);
//       //mesh.scale.set(100, 100, 100);
//       base.add(mesh);
//   });
//
//   var baseGeoEntity = new Cesium.Entity({
//       name: "Base " + i,
//       position: bases[i],
//       orientation: Cesium.Quaternion.IDENTITY
//   });
//   var baseGeoTarget = new THREE.Object3D;
//   baseGeoTarget.add(base);
//   scene.add(baseGeoTarget);
//
//   baseGeoTargets[i] = baseGeoTarget;
//   baseObjects[i] = base;
//   baseGeoEntities[i] = baseGeoEntity;
//
//   console.log("Base " + i + " created");
// }

var base1 = new THREE.Object3D;
var loader = new THREE.TextureLoader();
loader.load('images/braves_logo.png', function (texture) {
    //var geometry = new THREE.BoxGeometry(10, 10, 10);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.scale.set(100, 100, 100);
    base1.add(mesh);
});

var base1GeoEntity = new Cesium.Entity({
    name: "Base 1",
    position: Cartesian3.fromDegrees(-84.39662463963032, 33.781942974496715, 275),
    orientation: Cesium.Quaternion.IDENTITY
});
var base1GeoTarget = new THREE.Object3D;
base1GeoTarget.add(base1);
scene.add(base1GeoTarget);

// baseGeoTargets[i] = baseGeoTarget;
// baseObjects[i] = base;
// baseGeoEntities[i] = baseGeoEntity;

console.log("Base 1 created");

//----------

var base2 = new THREE.Object3D;
var loader = new THREE.TextureLoader();
loader.load('images/braves_logo.png', function (texture) {
    //var geometry = new THREE.BoxGeometry(10, 10, 10);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.scale.set(100, 100, 100);
    base2.add(mesh);
});

var base2GeoEntity = new Cesium.Entity({
    name: "Base 2",
    position: Cartesian3.fromDegrees(-84.39676277339458, 33.78193628646397, 276),
    orientation: Cesium.Quaternion.IDENTITY
});
var base2GeoTarget = new THREE.Object3D;
base2GeoTarget.add(base2);
scene.add(base2GeoTarget);

// baseGeoTargets[i] = baseGeoTarget;
// baseObjects[i] = base;
// baseGeoEntities[i] = baseGeoEntity;

console.log("Base 2 created");

//----------

var base3 = new THREE.Object3D;
var loader = new THREE.TextureLoader();
loader.load('images/braves_logo.png', function (texture) {
    //var geometry = new THREE.BoxGeometry(10, 10, 10);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.scale.set(100, 100, 100);
    base3.add(mesh);
});

var base3GeoEntity = new Cesium.Entity({
    name: "Base 3",
    position: Cartesian3.fromDegrees(-84.3966219574213, 33.78208565240452, 277),
    orientation: Cesium.Quaternion.IDENTITY
});
var base3GeoTarget = new THREE.Object3D;
base3GeoTarget.add(base3);
scene.add(base3GeoTarget);

// baseGeoTargets[i] = baseGeoTarget;
// baseObjects[i] = base;
// baseGeoEntities[i] = baseGeoEntity;

console.log("Base 3 created");

//----------

var base4 = new THREE.Object3D;
var loader = new THREE.TextureLoader();
loader.load('images/braves_logo.png', function (texture) {
    //var geometry = new THREE.BoxGeometry(10, 10, 10);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.scale.set(100, 100, 100);
    base4.add(mesh);
});

var base4GeoEntity = new Cesium.Entity({
    name: "Base 4",
    position: Cartesian3.fromDegrees(-84.39677618443966, 33.782117977834986, 278),
    orientation: Cesium.Quaternion.IDENTITY
});
var base4GeoTarget = new THREE.Object3D;
base4GeoTarget.add(base4);
scene.add(base4GeoTarget);

// baseGeoTargets[i] = baseGeoTarget;
// baseObjects[i] = base;
// baseGeoEntities[i] = baseGeoEntity;

console.log("Base 4 created");

//----------

var base5 = new THREE.Object3D;
var loader = new THREE.TextureLoader();
loader.load('images/braves_logo.png', function (texture) {
    //var geometry = new THREE.BoxGeometry(10, 10, 10);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.scale.set(100, 100, 100);
    base5.add(mesh);
});

var base5GeoEntity = new Cesium.Entity({
    name: "John",
    position: Cartesian3.fromDegrees(-84.15679720000003, 34.0563506, 314),
    orientation: Cesium.Quaternion.IDENTITY
});
var base5GeoTarget = new THREE.Object3D;
base5GeoTarget.add(base5);
scene.add(base5GeoTarget);

// baseGeoTargets[i] = baseGeoTarget;
// baseObjects[i] = base;
// baseGeoEntities[i] = baseGeoEntity;

console.log("Base 5 created");

//----------

var base6 = new THREE.Object3D;
var loader = new THREE.TextureLoader();
loader.load('images/braves_logo.png', function (texture) {
    //var geometry = new THREE.BoxGeometry(10, 10, 10);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.scale.set(100, 100, 100);
    base6.add(mesh);
});

var base6GeoEntity = new Cesium.Entity({
    name: "Arjun",
    position: Cartesian3.fromDegrees(-84.2761898, 33.8395538, 287),
    orientation: Cesium.Quaternion.IDENTITY
});
var base6GeoTarget = new THREE.Object3D;
base6GeoTarget.add(base6);
scene.add(base6GeoTarget);

// baseGeoTargets[i] = baseGeoTarget;
// baseObjects[i] = base;
// baseGeoEntities[i] = baseGeoEntity;

console.log("Base 6 created");

//----------

var lastInfoText = "";
var lastBoxText = "";

// make floating point output a little less ugly
function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}
// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.updateEvent.addEventListener(function (frame) {
    // get the position and orientation (the "pose") of the user
    // in the local coordinate frame.
    var userPose = app.context.getEntityPose(app.context.user);
    // set the pose of our THREE user object
    if (userPose.poseStatus & Argon.PoseStatus.KNOWN) {
        user.position.copy(userPose.position);
        user.quaternion.copy(userPose.orientation);
    }
    // get the pose of the "stage" to anchor our content.
    // The "stage" defines an East-Up-South coordinate system
    // (assuming geolocation is available).
    var stagePose = app.context.getEntityPose(app.context.stage);
    // set the pose of our THREE stage object
    if (stagePose.poseStatus & Argon.PoseStatus.KNOWN) {
        stage.position.copy(stagePose.position);
        stage.quaternion.copy(stagePose.orientation);
    }

    // for (var i = 0; i < bases.length; i++) {
    //   var baseGeoEntity = baseGeoEntities[i];
    //   var baseGeoTarget = baseGeoTargets[i];
    //   var basePose = app.context.getEntityPose(baseGeoEntity);
    //   if (basePose.poseStatus & Argon.PoseStatus.KNOWN) {
    //       baseGeoTarget.position.copy(basePose.position);
    //       console.log("Coordinates of base " + i + " obtained successfully");
    //   }
    //   else {
    //       console.log("Failed in getting coordinates for base " + i);
    //       // initialize to a fixed location in case we can't convert to geospatial
    //       baseGeoTarget.position.y = 0;
    //       baseGeoTarget.position.z = -4000;
    //       baseGeoTarget.position.x = 1000;
    //   }
    // }

    var base1Pose = app.context.getEntityPose(base1GeoEntity);
    if (base1Pose.poseStatus & Argon.PoseStatus.KNOWN) {
        base1GeoTarget.position.copy(base1Pose.position);
        console.log("Coordinates of base 1 obtained successfully");
    }
    else {
        console.log("Failed in getting coordinates for base 1");
        // initialize to a fixed location in case we can't convert to geospatial
        base1GeoTarget.position.y = 0;
        base1GeoTarget.position.z = -4000;
        base1GeoTarget.position.x = 1000;
    }

    var base2Pose = app.context.getEntityPose(base2GeoEntity);
    if (base2Pose.poseStatus & Argon.PoseStatus.KNOWN) {
        base2GeoTarget.position.copy(base2Pose.position);
        console.log("Coordinates of base 2 obtained successfully");
    }
    else {
        console.log("Failed in getting coordinates for base 2");
        // initialize to a fixed location in case we can't convert to geospatial
        base2GeoTarget.position.y = 0;
        base2GeoTarget.position.z = -4000;
        base2GeoTarget.position.x = 1000;
    }

    var base3Pose = app.context.getEntityPose(base3GeoEntity);
    if (base3Pose.poseStatus & Argon.PoseStatus.KNOWN) {
        base3GeoTarget.position.copy(base3Pose.position);
        console.log("Coordinates of base 3 obtained successfully");
    }
    else {
        console.log("Failed in getting coordinates for base 3");
        // initialize to a fixed location in case we can't convert to geospatial
        base3GeoTarget.position.y = 0;
        base3GeoTarget.position.z = -4000;
        base3GeoTarget.position.x = 1000;
    }

    var base4Pose = app.context.getEntityPose(base4GeoEntity);
    if (base4Pose.poseStatus & Argon.PoseStatus.KNOWN) {
        base4GeoTarget.position.copy(base4Pose.position);
        console.log("Coordinates of base 4 obtained successfully");
    }
    else {
        console.log("Failed in getting coordinates for base 4");
        // initialize to a fixed location in case we can't convert to geospatial
        base4GeoTarget.position.y = 0;
        base4GeoTarget.position.z = -4000;
        base4GeoTarget.position.x = 1000;
    }

    var base5Pose = app.context.getEntityPose(base5GeoEntity);
    if (base5Pose.poseStatus & Argon.PoseStatus.KNOWN) {
        base5GeoTarget.position.copy(base5Pose.position);
        console.log("Coordinates of base 5 obtained successfully");
    }
    else {
        console.log("Failed in getting coordinates for base 5");
        // initialize to a fixed location in case we can't convert to geospatial
        base5GeoTarget.position.y = 0;
        base5GeoTarget.position.z = -4000;
        base5GeoTarget.position.x = 1000;
    }

    var base6Pose = app.context.getEntityPose(base6GeoEntity);
    if (base6Pose.poseStatus & Argon.PoseStatus.KNOWN) {
        base6GeoTarget.position.copy(base6Pose.position);
        console.log("Coordinates of base 6 obtained successfully");
    }
    else {
        console.log("Failed in getting coordinates for base 6");
        // initialize to a fixed location in case we can't convert to geospatial
        base6GeoTarget.position.y = 0;
        base6GeoTarget.position.z = -4000;
        base6GeoTarget.position.x = 1000;
    }

    // rotate the boxes at a constant speed, independent of frame rates
    // to make it a little less boring
    // for (var i = 0; i < bases.length; i++) {
    //   var base = baseObjects[i];
    //   base.rotateY(2 * frame.deltaTime / 10000);
    // }
    base1.rotateY(2 * frame.deltaTime / 10000);
    base2.rotateY(2 * frame.deltaTime / 10000);
    base3.rotateY(2 * frame.deltaTime / 10000);
    base4.rotateY(2 * frame.deltaTime / 10000);
    base5.rotateY(2 * frame.deltaTime / 10000);
    base6.rotateY(2 * frame.deltaTime / 10000);

    var infoText = "Geospatial Argon example:<br>";
    // get user position in global coordinates
    var userPoseFIXED = app.context.getEntityPose(app.context.user, ReferenceFrame.FIXED);
    if (userPoseFIXED.poseStatus & Argon.PoseStatus.KNOWN) {
        var userLLA = Cesium.Ellipsoid.WGS84.cartesianToCartographic(userPoseFIXED.position);
        if (userLLA) {
            gpsCartographicDeg = [
                CesiumMath.toDegrees(userLLA.longitude),
                CesiumMath.toDegrees(userLLA.latitude),
                userLLA.height
            ];
            infoText += "Your location is lla (" + toFixed(gpsCartographicDeg[0], 6) + ", ";
            infoText += toFixed(gpsCartographicDeg[1], 6) + ", " + toFixed(gpsCartographicDeg[2], 2) + ")<br>";
        }
    }
    else {
        infoText += "Your location is unknown<br>";
    }

    if (lastInfoText !== infoText) {
        locationElements[0].innerHTML = infoText;
        locationElements[1].innerHTML = infoText;
        lastInfoText = infoText;
    }

});
// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function () {
    // set the renderers to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var view = app.view;
    renderer.setSize(view.renderWidth, view.renderHeight, false);
    renderer.setPixelRatio(app.suggestedPixelRatio);
    var viewport = view.viewport;
    cssRenderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);
    // There is 1 subview in monocular mode, 2 in stereo mode.
    // If we are in mono view, show the description.  If not, hide it,
    if (app.view.subviews.length > 1) {
        holder.style.display = 'none';
    }
    else {
        holder.style.display = 'block';
    }
    // there is 1 subview in monocular mode, 2 in stereo mode
    for (var _i = 0, _a = app.view.subviews; _i < _a.length; _i++) {
        var subview = _a[_i];
        var frustum = subview.frustum;
        // set the position and orientation of the camera for
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera.
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        // set the webGL rendering parameters and render this view
        // set the viewport for this view
        var _b = subview.renderViewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        renderer.setViewport(x, y, width, height);
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // set the viewport for this view
        var _c = subview.viewport, x = _c.x, y = _c.y, width = _c.width, height = _c.height;
        // set the CSS rendering up, by computing the FOV, and render this view
        camera.fov = THREE.Math.radToDeg(frustum.fovy);
        cssRenderer.setViewport(x, y, width, height, subview.index);
        cssRenderer.render(scene, camera, subview.index);
        // adjust the hud
        hud.setViewport(x, y, width, height, subview.index);
        hud.render(subview.index);
    }
});
