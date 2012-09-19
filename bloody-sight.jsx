/*
Add Bloody Vignette Script
Greg Dorsainville
ITP Fall 2012
Open Source Motion Capture
Prof: Nick Fox-Gieg

this script runs in any comp. It adds a darkened vignette layer, and a box blur that uses the vignette
as a track matte. It also adds a pulsating red solid to mimic the injured First person popular in first
person video shooters.

*/

{  //start script
	app.beginUndoGroup("Add Vignette");

	// Selected Composition
	var comp = app.project.activeItem;

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	//*** Blur layer  ***
	//add adjustment layer 
	var new_adjustment = comp.layers.addSolid([1,1,1], "Blur", comp.width,comp.height,comp.pixelAspect,comp.duration);
   	new_adjustment.adjustmentLayer  = true;

	//add blur effect
	var adjustBlur = new_adjustment.property("Effects").addProperty("Box Blur");
	adjustBlur.property("Blur Radius").setValue(50);
	adjustBlur.property("Iterations").setValue(3);
	adjustBlur.property("Repeat Edge Pixels").setValue(true);
	//change track matte

	new_adjustment.trackMatteType = TrackMatteType.ALPHA;


	//**** VIGNETTE and Blur matte****
	//add solid
	var vignette = comp.layers.addSolid([0,0,0], "Vignette", comp.width, comp.height, 1);
	//add ellipse mask
	var newMask = vignette.Masks.addProperty("ADBE Mask Atom");
	//change settings of mask
	
	ratio = .5523;
	h = vignette.width/2;
	v = vignette.height/2;
	th = h*ratio;
	tv = v*ratio;
	
	newMask.maskMode = MaskMode.SUBTRACT;
	newMask.maskFeather.setValue([300,300]);
	newMask.maskOpacity.setValue(100);
	newMask.property("Mask Expansion").setValue(60);
	myProperty = newMask.property("ADBE Mask Shape");
	myShape = myProperty.value;
	myShape.vertices = [[h,0],[0,v],[h,2*v],[2*h,v]];
	myShape.inTangents = [[th,0],[0,-tv],[-th,0],[0,tv]];
	myShape.outTangents = [[-th,0],[0,tv],[th,0],[0,-tv]];
	myShape.closed = true;
	myProperty.setValue(myShape);
	
	var vignetteTrackMatte = comp.layers.addSolid([0,0,0], "Blur Track Matte", comp.width, comp.height, 1);
	//add ellipse mask
	vignetteTrackMatte.enabled = false;
	vignetteTrackMatte.moveBefore(new_adjustment);
	var newMask2 = vignetteTrackMatte.Masks.addProperty("ADBE Mask Atom");
	//change settings of mask
	
	newMask2.maskMode = MaskMode.SUBTRACT;
	newMask2.maskFeather.setValue([125,125]);
	newMask2.maskOpacity.setValue(100);
	newMask2.property("Mask Expansion").setValue(-100);
	myProperty2 = newMask2.property("ADBE Mask Shape");
	myShape2 = myProperty.value;
	myShape2.vertices = [[h,0],[0,v],[h,2*v],[2*h,v]];
	myShape2.inTangents = [[th,0],[0,-tv],[-th,0],[0,tv]];
	myShape2.outTangents = [[-th,0],[0,tv],[th,0],[0,-tv]];
	myShape2.closed = true;
	myProperty2.setValue(myShape2);

	//*** pulsing red ***
	//make new red layer
	var pulseSolid = comp.layers.addSolid([255,0,0], "Pulsing Light", comp.width, comp.height, 1);

	//set opacity to 20%
	pulseSolid.property("opacity").setValue(20);
	
	//change transfer mode to add
	pulseSolid.blendingMode = BlendingMode.ADD;
	//add expression to opacity to make it flash: t = 5*time; x = Math.cos(t)*70; x;
	pulseSolid.opacity.expression = "t = 5*time;x = Math.cos(t)*70;x;";
	pulseSolid.position.expressionEnabled = true;
	pulseSolid.moveAfter(new_adjustment);

	
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	app.endUndoGroup();
}  //end script