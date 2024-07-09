import "./index.scss";
import { useState } from "react";
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon } from "@wordpress/components";

wp.blocks.registerBlockType("ourplugin/are-you-paying-attention", {
  title: "Are You Paying Attention?",
  icon: "smiley",
  category: "common",
  attributes: {
    question: {type: "string"},
    answers: {type: "array", default: ["red", "blue", "orange"]}
  },
  edit: EditComponent,
  save: function (props) {
    return null;
  }
});


function EditComponent(props) {

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
    }
    // return wp.element.createElement("h3", null, "This is on edit post/page.");
    return (
        <div className="paying-attention-edit-block">
            <TextControl label="Question:" style={{fontSize: "20px"}} value={props.attributes.question} onChange={updateQuestion}/>
            <p style={{fontSize: "13px", margin: "20px 0 8px 0"}}>Answers:</p>
            {props.attributes.answers.map((answer, index) => {
                return (
                    <Flex key={index}>
                        <FlexBlock>
                            <TextControl value={answer} onChange={newValue => updateAnswer(newValue, index)}/>
                        </FlexBlock>
                        <FlexItem>
                            <Button>
                                <Icon className="mark-as-correct" icon="star-empty"/>
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