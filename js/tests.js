$(document).ready(function(){

    var make_control_bind_data_mug = function(){
        var myMug;

        //Control Element
        var typeName = "input";
        var myControl = new formdesigner.model.ControlElement(
                {
                    name:"Text",
                    tagName: "input",
                    label:"What is your name?",
                    hintLabel:"Enter the client's name",
                    labelItext:"Q1EN",
                    hintItext:"Q1ENH"
                }
        );

        //Data Element
        var name = "question1";
        var initialData = "foo";
        var spec = {
            dataValue: initialData,
            nodeID: "data_for_question1"
        }
        var myData = formdesigner.model.DataElement(spec);

        //Bind Element
        var attributes = {
            dataType: "xsd:text",
            constraintAttr: "length(.) > 5",
            constraintMsgAttr: "Town Name must be longer than 5!",
            nodeID: "question1"
        };
        spec =  attributes;
        var myBind = new formdesigner.model.BindElement(spec);

        var mugSpec = {
            dataElement: myData,
            bindElement: myBind,
            controlElement: myControl
        }
        myMug = new formdesigner.model.Mug(mugSpec);

        return {
            control: myControl,
            data: myData,
            bind: myBind,
            mug: myMug
        };
    }

    module("LiveText Unit Tests");
    test("Create and Verify LiveText", function(){
        expect(4);

        ////////
        var liveText = new formdesigner.model.LiveText();
        ok(typeof liveText === 'object',"LiveText object should be an Object");

        ////////
        liveText.addToken("Test String");
        equal(liveText.renderString(),"Test String", "Check for correct rendering of added string 'Test String'")

        ////////
        var testObj = (function (){
            var that = {};
            var text = "Some Text";
            var cbFunc = function(){
                return this.text;
            };
            that.text = text;
            that.cbFunc = cbFunc;
            return that;
        })();
        liveText.addToken(testObj,testObj.cbFunc);
        equal(liveText.renderString(),"Test StringSome Text","correct rendering of obj token with callback");

        ////////
        var otherObj = {text: " Meow Mix times: "};
        otherObj.cbFunc = function(n){
            return this.text + n;
        };
        liveText.addToken(otherObj,otherObj.cbFunc,[5]);
        equal(liveText.renderString(),"Test StringSome Text Meow Mix times: 5", "rendering with callback + params");
    });
    test("Test additional LiveText object", function(){
        expect(2);

        ///////
        var otherLiveText = new formdesigner.model.LiveText;
        equal(otherLiveText.renderString(),"", 'test render empty liveText');

        ///////
        otherLiveText.addToken("foo ");
        otherLiveText.addToken("bar");
        equal(otherLiveText.renderString(),"foo bar", "check creation of additional LiveText and that it produces correct results");

    });

    module("Bind Element");
    test("Create a bind with and without arguments", function(){
       expect(8);
       var myBind = new formdesigner.model.BindElement();
       ok(typeof myBind === 'object', "Is it an object?");

       //make the spec object for the bind constructor
        var spec = {
            dataRef: "question1",
            dataType: "text",
            constraint: "length(.) > 5",
            constraintMsg: "Town Name must be longer than 5!",
            id: "someUniqueBindID"
        };


        var myOtherBind = new formdesigner.model.BindElement(spec);

        //check if the bind was created properly
        equal(myOtherBind.properties.dataRef, spec.dataRef, "Shortcut to dataRef correctly set");
        equal(myOtherBind.properties.dataType, spec.dataType, "Shortcut to dataRef correctly set");
        equal(myOtherBind.properties.constraint, spec.constraint, "Shortcut to dataRef correctly set");
        equal(myOtherBind.properties.constraintMsg, spec.constraintMsg, "Shortcut to dataRef correctly set");
        equal(myOtherBind.properties.id, spec.id, "Shortcut to id correctly set");

        //test that a unique formdesigner id was generated for this object (well, kind of)
        equal(typeof myOtherBind.ufid, 'string', "Is the ufid a string?");

        notEqual(myBind.ufid,myOtherBind.ufid, "Make sure that the ufids are unique");
//        ok(typeof myOtherBind.ufid === 'string', "Is the ufid a string?");
    });

    module("Data Element");
    test("Create a data Element with and without", function(){
        expect(6);
        var myData = new formdesigner.model.DataElement();
        ok(typeof myData === 'object', "Is it an object?");

        var name = "question1";
        var initialData = "foo";
        var spec = {
            name: name,
            defaultData: initialData
        }

        var otherData = formdesigner.model.DataElement(spec);
        ok(typeof otherData === 'object', "Is it an object? (with args)");
        equal(otherData.properties.name,name,"Was the name attribute set correctly?");
        equal(otherData.properties.defaultData,initialData,"Is initialData correct?");
        equal(typeof otherData.ufid, 'string', "Is ufid a string and exists?");
        notEqual(otherData,myData,"Test that data elements are unique");
    });

    module("Control Element");
    test("Control Element Default", function(){
        expect(2);
        var emptyControl = new formdesigner.model.ControlElement();
        ok(typeof emptyControl === 'object', "Is emptyControl an object?");

        var typeName = "input";
        var fullControl = new formdesigner.model.ControlElement(
                {
                    typeName:typeName
                }
        );

        notEqual(emptyControl.ufid,fullControl.ufid,"Check that ufids are not equal for ControlElements");

    });
    test("Control Element with additional init value", function(){
        expect(2);
               //Control Element
        var typeName = "input";
        var myControl = new formdesigner.model.ControlElement(
                {
                    typeName:typeName,
                    label:"What is your name?",
                    hintLabel:"Enter the client's name",
                    labelItext:"Q1EN",
                    hintItext:"Q1ENH"
                }
        );

        equal(myControl.properties.typeName,typeName, "Was type name set?");
        equal(typeof myControl.ufid,'string', "Does ufid exist?")
    });

    module("Mug Unit Tests");
    test("Create and Verify Mug with null constructor", function(){
        expect(4);
        var myMug = new formdesigner.model.Mug();
        ok(typeof myMug === 'object',"Test that the object is an object");

        ok(typeof myMug.properties.bindElement === 'undefined', "BindElement should not exist in object constructed with no params");
        ok(typeof myMug.properties.controlElement === 'undefined', "ControlElement should not exist in object constructed with no params");
        ok(typeof myMug.properties.dataElement === 'undefined', "DataElement should not exist in object constructed with no params");

    });
    test("Create and Verify Mug with fake Bind,Control and Data element specified in Constructor", function(){
        expect(4);
        var specObj = {
           bindElement: {},
           controlElement: {},
           dataElement: {}
        }
        var myMug = new formdesigner.model.Mug(specObj);
        ok(typeof myMug === 'object',"Test that the object is an object");

        ok(typeof myMug.properties.bindElement === 'object', "BindElement should exist in object constructed with params");
        ok(typeof myMug.properties.controlElement === 'object', "ControlElement should exist in object constructed with params");
        ok(typeof myMug.properties.dataElement === 'object', "DataElement should exist in object constructed with params");
    });
    test("Create populated Mug", function(){
       expect(5);
        var testData = make_control_bind_data_mug();
        var myMug = testData.mug;
        var myControl = testData.control;
        var myBind = testData.bind;
        var myData = testData.data;
        ok(typeof myMug === 'object',"Is this populated mug an object?");
        equal(typeof myMug.definition,'undefined', "Is the definition undefined?");
        deepEqual(myMug.properties.controlElement,myControl,"Control Element check");
        deepEqual(myMug.properties.bindElement,myBind, "Bind Element check");
        deepEqual(myMug.properties.dataElement,myData, "Data Element check");






    });
    module("MugType tests");
    test("Validate example mug against definition", function(){
        expect(3);
        var testData = make_control_bind_data_mug();
        var myMug = testData.mug;
        var MugType = formdesigner.util.getNewMugType(formdesigner.model.mugTypes["stdTextQuestion"]); //simulates a 'standard' text question

        var validationObject = MugType.validateMug(myMug);
        equal(MugType.typeName, "Text Question MugType");
        equal(validationObject.status, "pass", 'Does the mug validate against the MugType?');

        var otherType = formdesigner.model.mugTypes.dataBindControlQuestion;
        otherType.properties.bindElement['someProperty'] = 'foo';
        console.log("==== BEGIN IGNORE FAILED VALIDATION IN LOG");
        var vObj = otherType.validateMug(myMug);
        console.log("==== END IGNORE FAILED VALIDATION IN LOG");
        equal(vObj.status,'fail', "This should fail because the mug does not contain the required property");

    });

    test("Test custom validation function in bind block definition", function(){
        expect(2);
        var testData = make_control_bind_data_mug();
        var myMug = testData.mug;
        myMug.properties.bindElement.properties.constraintAttr = "foo";
        myMug.properties.bindElement.properties.constraintMsgAttr = undefined;
        var MugType = formdesigner.util.getNewMugType(formdesigner.model.mugTypes["stdTextQuestion"]); //simulates a 'standard' text question

        var validationObject = MugType.validateMug(myMug);
        equal(validationObject.status,'pass', "Mug has a constraint but no constraint message which is OK");

        //now remove constraint but add a constraint message
        myMug.properties.bindElement.properties.constraintAttr = undefined;
        myMug.properties.bindElement.properties.constraintMsgAttr = "foo";
        console.log("==== START IGNORE FAILED VALIDATION IN LOG");
        validationObject = MugType.validateMug(myMug);
        console.log("==== END IGNORE FAILED VALIDATION IN LOG");
        equal(validationObject.status,'fail', "Special validation function has detected a constraintMsg but no constraint attribute in the bindElement");
    });

    test("MugType creation tools", function(){
        expect(2);
        var testData = make_control_bind_data_mug();
        var myMug = testData.mug;
        myMug.properties.bindElement.constraintAttr = "foo";
        myMug.properties.bindElement.constraintMsgAttr = undefined;
        var MugType = formdesigner.model.RootMugType; //simulates a 'standard' text question

        var OtherMugType = formdesigner.util.getNewMugType(MugType);
        notDeepEqual(MugType,OtherMugType);

        OtherMugType.typeName = "This is a different Mug";
        notEqual(MugType.typeName,OtherMugType.typeName);

    });

    module("Automatic Mug Creation from MugType");
    test("Create mug from root MugType", function(){
        expect(2);
        var mugType = formdesigner.util.getNewMugType(formdesigner.model.mugTypes["stdTextQuestion"]);
        var mug = formdesigner.controller.createMugFromMugType(mugType);
        ok(typeof mug === 'object', "Mug is an Object");
        equal(mugType.validateMug(mug).status,'pass', "Mug passes validation");
    });
    test("Test sub MugType and Mug creation",function(){
        expect(23);
        //capital A for 'Abstract'
        var AdbType  = formdesigner.model.mugTypes.dataBind,
            AdbcType = formdesigner.model.mugTypes.dataBindControlQuestion,
            AdcType  = formdesigner.model.mugTypes.dataControlQuestion,
            AdType   = formdesigner.model.mugTypes.dataOnly,
        tMug,Mug;

        tMug = formdesigner.util.getNewMugType(AdbType);
        Mug = formdesigner.controller.createMugFromMugType(tMug);
        ok(typeof tMug === 'object', "MugType creation successful for '"+tMug.typeName+"' MugType");
        ok(tMug.validateMug(Mug).status === 'pass', "Mug created from '"+tMug.typeName+"' MugType passes validation");
        ok(typeof Mug.properties.controlElement === 'undefined', "Mug's ControlElement is undefined");
        ok(typeof Mug.properties.bindElement === 'object', "Mug's bindElement exists");
        ok(typeof Mug.properties.dataElement === 'object', "Mug's dataElement exists");
        equal(Mug.properties.dataElement.properties.nodeID,Mug.properties.bindElement.properties.nodeID);

        tMug = formdesigner.util.getNewMugType(AdbcType);
        Mug = formdesigner.controller.createMugFromMugType(tMug);
        ok(typeof tMug === 'object', "MugType creation successful for '"+tMug.typeName+"' MugType");
        ok(tMug.validateMug(Mug).status === 'pass', "Mug created from '"+tMug.typeName+"' MugType passes validation");
        ok(typeof Mug.properties.controlElement === 'object', "Mug's ControlElement exists");
        ok(typeof Mug.properties.bindElement === 'object', "Mug's bindElement exists");
        ok(typeof Mug.properties.dataElement === 'object', "Mug's dataElement exists");
        equal(Mug.properties.dataElement.properties.nodeID,Mug.properties.bindElement.properties.nodeID);

        tMug = formdesigner.util.getNewMugType(AdcType);
        Mug = formdesigner.controller.createMugFromMugType(tMug);
        ok(typeof tMug === 'object', "MugType creation successful for '"+tMug.typeName+"' MugType");
        ok(tMug.validateMug(Mug).status === 'pass', "Mug created from '"+tMug.typeName+"' MugType passes validation");
        ok(typeof Mug.properties.controlElement === 'object', "Mug's ControlElement exists");
        ok(typeof Mug.properties.bindElement === 'undefined', "Mug's bindElement is undefined");
        ok(typeof Mug.properties.dataElement === 'object', "Mug's dataElement exists");

        tMug = formdesigner.util.getNewMugType(AdType);
        Mug = formdesigner.controller.createMugFromMugType(tMug);
        ok(typeof tMug === 'object', "MugType creation successful for '"+tMug.typeName+"' MugType");
        ok(tMug.validateMug(Mug).status === 'pass', "Mug created from '"+tMug.typeName+"' MugType passes validation");
        ok(typeof Mug.properties.controlElement === 'undefined', "Mug's ControlElement is undefined");
        ok(typeof Mug.properties.bindElement === 'undefined', "Mug's bindElement is undefined");
        ok(typeof Mug.properties.dataElement === 'object', "Mug's dataElement exists");
        ok(Mug.properties.dataElement.properties.nodeID.toLocaleLowerCase().indexOf('question') != -1);
        
    });

    module("Tree Data Structure Tests");
    test("Trees", function(){
//        expect(7);

        ///////////BEGIN SETUP///////
        var mugTA = formdesigner.util.getNewMugType(formdesigner.model.mugTypes.dataBindControlQuestion),
            mugTB = formdesigner.util.getNewMugType(formdesigner.model.mugTypes.dataBindControlQuestion),
            mugTC = formdesigner.util.getNewMugType(formdesigner.model.mugTypes.dataBindControlQuestion),
            mugA = formdesigner.controller.createMugFromMugType(mugTA),
            mugB = formdesigner.controller.createMugFromMugType(mugTB),
            mugC = formdesigner.controller.createMugFromMugType(mugTC),
            tree = new formdesigner.model.Tree('data');
        var GNMT = formdesigner.util.getNewMugType;
        var createMugFromMugType = formdesigner.controller.createMugFromMugType;
        var DBCQuestion = formdesigner.model.mugTypes.dataBindControlQuestion;

        tree.insertMugType(mugTA, null, null); //add mugA as a child of the rootNode
        tree.insertMugType(mugTB, 'into',mugTA ); //add mugB as a child of mugA...
        tree.insertMugType(mugTC, 'into', mugTB); //...
        //////////END SETUP//////////

        var actualPath = tree.getAbsolutePath(mugTC);
        var expectedPath =  '/'+mugTA.mug.properties.dataElement.properties.nodeID+
                            '/'+mugTB.mug.properties.dataElement.properties.nodeID+
                            '/'+mugTC.mug.properties.dataElement.properties.nodeID;
        equal(actualPath, expectedPath, 'Is the generated DataElement path for the mug correct?');

        var treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
                tree._getMugTypeNodeID(mugTA)+'['+
                tree._getMugTypeNodeID(mugTB)+'['+
                tree._getMugTypeNodeID(mugTC)+']]]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');

        actualPath = tree.getAbsolutePath(mugTC);
        tree.removeMugType(mugTC);
        tree.insertMugType(mugTC,'into',mugTB);
        equal(actualPath,expectedPath, 'Is the path still correct after removal and insertion (into the same place');

        treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
                tree._getMugTypeNodeID(mugTA)+'['+
                tree._getMugTypeNodeID(mugTB)+'['+
                tree._getMugTypeNodeID(mugTC)+']]]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');
        
        tree.insertMugType(mugTC, 'into', mugTA);
        actualPath = tree.getAbsolutePath(mugTC);
        expectedPath =  '/'+mugTA.mug.properties.dataElement.properties.nodeID+
                        '/'+mugTC.mug.properties.dataElement.properties.nodeID;
        equal(actualPath, expectedPath, 'After move is the calculated path still correct?');

        treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
                tree._getMugTypeNodeID(mugTA)+'['+
                tree._getMugTypeNodeID(mugTB)+','+
                tree._getMugTypeNodeID(mugTC)+']]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');

        tree.removeMugType(mugTB);
        raises(function(){tree.getAbsolutePath(mugTB)}, "Cant find path of MugType that is not present in the Tree!");

        tree.insertMugType(mugTB,'before',mugTC);
        treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
            tree._getMugTypeNodeID(mugTA)+'['+
            tree._getMugTypeNodeID(mugTB)+','+
            tree._getMugTypeNodeID(mugTC)+']]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');

        tree.insertMugType(mugTC, 'before', mugTB);
        treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
            tree._getMugTypeNodeID(mugTA)+'['+
            tree._getMugTypeNodeID(mugTC)+','+
            tree._getMugTypeNodeID(mugTB)+']]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');

        var mugTD = GNMT(DBCQuestion);
        var mugD = createMugFromMugType(mugTD);
        tree.insertMugType(mugTD, 'before', mugTA);
        equal('/'+mugTD.mug.properties.dataElement.properties.nodeID, tree.getAbsolutePath(mugTD),
             "Check that the newly inserted Mug's generated path is correct");

        treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
            tree._getMugTypeNodeID(mugTD)+','+
            tree._getMugTypeNodeID(mugTA)+'['+
            tree._getMugTypeNodeID(mugTC)+','+
            tree._getMugTypeNodeID(mugTB)+']]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');

        tree.insertMugType(mugTD,'after',mugTB);
        treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
            tree._getMugTypeNodeID(mugTA)+'['+
            tree._getMugTypeNodeID(mugTC)+','+
            tree._getMugTypeNodeID(mugTB)+','+
            tree._getMugTypeNodeID(mugTD)+']]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');
        console.log('MugTB node ID is:'+ tree._getMugTypeNodeID(mugTB));
        console.log('MugTD node ID is:'+ tree._getMugTypeNodeID(mugTD));
        console.log("EXPECTED");
        console.log(treePrettyPrintExpected);
        console.log("ACTUAL");
        console.log(tree.printTree());

        tree.insertMugType(mugTD,'after',mugTC);
        treePrettyPrintExpected = ''+tree._getRootNodeID()+'['+
            tree._getMugTypeNodeID(mugTA)+'['+
            tree._getMugTypeNodeID(mugTC)+','+
            tree._getMugTypeNodeID(mugTD)+','+
            tree._getMugTypeNodeID(mugTB)+']]';
        equal(treePrettyPrintExpected,tree.printTree(), 'Check the tree structure is correct');

        var tempMT = tree.getMugTypeFromUFID(mugTA.mug.ufid);
        deepEqual(mugTA, tempMT, "Check getMugTypeFromUFID() method works correctly");

        tempMT = tree.getMugTypeFromUFID("foobar");
        equal(tempMT, null, "Check getMugTypeFromUFID('notAUFID') returns null");

        tempMT = tree.getMugTypeFromUFID(mugTD.mug.ufid);
        deepEqual(mugTD,tempMT);


    });


});



function divide(a,b){
    return a/b;
}