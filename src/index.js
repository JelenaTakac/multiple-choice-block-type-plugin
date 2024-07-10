import "./index.scss";
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker } from "@wordpress/components";
import { InspectorControls, BlockControls, AlignmentToolbar, useBlockProps } from "@wordpress/block-editor";
import {ChromePicker} from "react-color";

(function() {
  let locked = false
  
  wp.data.subscribe(function() {
    const results = wp.data.select("core/block-editor").getBlocks().filter(function(block) {
      return block.name == "ourplugin/are-you-paying-attention" && block.attributes.correctAnswer == undefined
    })

    if (results.length && locked == false) {
      locked = true
      wp.data.dispatch("core/editor").lockPostSaving("noanswer")
    }

    if (!results.length && locked) {
      locked = false
      wp.data.dispatch("core/editor").unlockPostSaving("noanswer")
    }
  })
})()

wp.blocks.registerBlockType("ourplugin/are-you-paying-attention", {
  title: "Are You Paying Attention?",
  icon: "smiley",
  category: "common",
  attributes: {
    question: {type: "string"},
    answers: {type: "array", default: [""]},
    correctAnswer: {type: "number", default: undefined},
    bgColor: {type: "string", default: "#ebebeb"},
    theAlignment: {type: "string", default: "left"}
  },
  description: "Give your audience a chance to prove their comprehension.",
  example: {
    attributes: {
        question: "What is my name?",
        correctAnswer: 3,
        answers: ['Meowsalot', 'Barksalot', 'Brad', 'Jelena'],
        theAlignment: "center",
        bgColor: "#cfe8f1"
    }
  },
  edit: EditComponent,
  save: function (props) {
    return null;
  }
});


function EditComponent(props) {
    const blockProps = useBlockProps({
        className: "paying-attention-edit-block",
        style: {backgroundColor: props.attributes.bgColor}
    });

    function updateQuestion(value) {
        props.setAttributes({question: value});
    }

    function updateAnswer(value, index) {
        const newAnswers = [...props.attributes.answers];
        newAnswers[index] = value;
        props.setAttributes({ answers: newAnswers });
    }

    function addNewAnswer() {
        props.setAttributes({ answers: [...props.attributes.answers, ""] });
    }

    function deleteAnswer(indexToDelete) {
        const newAnswers = props.attributes.answers.filter((answer, i) => answer[i] != answer[indexToDelete]);
        props.setAttributes({ answers: newAnswers });

        if (indexToDelete == props.attributes.correctAnswer) {
            props.setAttributes({ correctAnswer: undefined });
        }
    }

    function markAsCorrect(index) {
        props.setAttributes({ correctAnswer: index });
    }

    return (
        <div {...blockProps}>
            <BlockControls>
                <AlignmentToolbar value={props.attributes.theAlignment} onChange={x => props.setAttributes({theAlignment: x})} />
            </BlockControls>
            <InspectorControls>
                <PanelBody title="Background Color" initialOpen={true}>
                    <PanelRow>
                        <ChromePicker color={props.attributes.bgColor} onChangeComplete={x => props.setAttributes({bgColor: x.hex})} disableAlpha={true}/>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <TextControl label="Question:" style={{fontSize: "20px"}} value={props.attributes.question} onChange={updateQuestion}/>
            <p style={{fontSize: "13px", margin: "20px 0 8px 0"}}>Answers:</p>
            {props.attributes.answers.map((answer, index) => {
                return (
                    <Flex key={index}>
                        <FlexBlock>
                            <TextControl value={answer} onChange={newValue => updateAnswer(newValue, index)}/>
                        </FlexBlock>
                        <FlexItem>
                            <Button onClick={() => markAsCorrect(index)}>
                                <Icon className="mark-as-correct" icon={props.attributes.correctAnswer == index ? "star-filled" : "star-empty"}/>
                            </Button>
                        </FlexItem>
                        <FlexItem>
                            <Button variant="link" className="attention-delete" onClick={() => deleteAnswer(index)}>Delete</Button>
                        </FlexItem>
                    </Flex>
                )
            })}
            <Button variant="primary" onClick={addNewAnswer}>Add another answer</Button>
        </div>
    );
  }