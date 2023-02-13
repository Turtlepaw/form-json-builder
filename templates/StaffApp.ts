import { isEmpty, isId } from "../util/common";
import { Replacer } from "../util/template";

const modal = (title: string) => ({
    "title": title,
    "components": [
        {
            "type": 1,
            "components": [
                {
                    "type": 4,
                    "label": "Why are you applying for this position?",
                    "style": 2
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    "type": 4,
                    "label": "How long have you been in the server?",
                    "style": 1
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    "type": 4,
                    "label": "Tell us about yourself",
                    "style": 2
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    "type": 4,
                    "label": "What is your timezone?",
                    "style": 1
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    "type": 4,
                    "label": "Have you had any previous moderation experience?",
                    "style": 2
                }
            ]
        }
    ]
});

export const replacers: () => Replacer[] = () => {
    const replacerItems: Replacer[] = [
        {
            label: "Submit Channel ID",
            max: "19",
            set(forms, newData) {
                console.log(forms.map(e => e.submit_channel_id))
                return forms.map((form: any, index: number) => forms[index].submit_channel_id = newData);
            },
            satisfied(forms) {
                const val = forms.map((form: any) => isId(form.submit_channel_id)).every(e => e == true);
                return true;
            },
            helpLink: "https://gist.github.com/Turtlepaw/490ff933b0f4262f65977473536e3b3d",
            formIndex: 0
        }, {
            label: "Administrator Role ID",
            max: "19",
            set(form, newData) {
                return form[0].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER = newData;
            },
            get(form) {
                return form[0].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER;
            },
            satisfied(form) {
                const val = form[0].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER as string;
                return !isEmpty(val) && isId(val);
            },
            helpLink: "https://gist.github.com/Turtlepaw/490ff933b0f4262f65977473536e3b3d",
            formIndex: 0
        },
        {
            label: "Moderator Role ID",
            max: "19",
            set(form, newData) {
                return form[1].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER = newData;
            },
            get(form) {
                return form[1].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER;
            },
            satisfied(form) {
                const val = form[1].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER as string;
                return !isEmpty(val) && isId(val);
            },
            helpLink: "https://gist.github.com/Turtlepaw/490ff933b0f4262f65977473536e3b3d",
            formIndex: 1
        },
        {
            label: "Helper Role ID",
            max: "19",
            set(form, newData) {
                return form[2].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER = newData;
            },
            get(form) {
                return form[2].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER;
            },
            satisfied(form) {
                const val = form[2].submit_components[0].components[0].logic.ADD_ROLE_TO_SUBMITTER as string;
                return !isEmpty(val) && isId(val);
            },
            helpLink: "https://gist.github.com/Turtlepaw/490ff933b0f4262f65977473536e3b3d",
            formIndex: 2
        }];

    return replacerItems.map(e => {
        e.satisfied = () => true
        return e;
    })
}

export const data = {
    "message": {
        "content": "**Staff Applications**",
        "embeds": []
    },
    "select_menu_placeholder": "Choose a position to apply for",
    "forms": [
        {
            "select_menu_option": {
                "label": "Administrator",
                "description": "Oversee the health and well-being of the community",
                "emoji": {
                    "id": "1015248668066074725"
                }
            },
            "submit_channel_id": "YOUR_SUBMIT_CHANNEL_ID",
            "modal": modal("Administrator Application"),
            "submit_components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Promote to Admin",
                            "style": 3,
                            "logic": {
                                "DM_SUBMITTER": {
                                    "content": "Your **{FormTitle}** has been accepted!"
                                },
                                "DISABLE_ALL_COMPONENTS": false,
                                "REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW": true,
                                "UPDATE_COMPONENT": {
                                    "label": "Promoted to Admin"
                                },
                                "ADD_ROLE_TO_SUBMITTER": "YOUR_ROLE_ID"
                            }
                        },
                        {
                            "type": 2,
                            "label": "Deny",
                            "style": 4,
                            "logic": {
                                "DM_SUBMITTER_WITH_MODAL_INPUT": {
                                    "modal": {
                                        "title": "Deny Form",
                                        "components": [
                                            {
                                                "type": 1,
                                                "components": [
                                                    {
                                                        "type": 4,
                                                        "style": 2,
                                                        "label": "Reason for denial"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "message": {
                                        "content": "Sorry! Your **{FormTitle}** has been denied.",
                                        "embeds": [
                                            {
                                                "title": "Reason",
                                                "description": "{TextInputValue1}"
                                            }
                                        ]
                                    }
                                },
                                "DISABLE_ALL_COMPONENTS": false,
                                "REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW": true,
                                "UPDATE_COMPONENT": {
                                    "label": "Denied"
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            "select_menu_option": {
                "label": "Moderator",
                "description": "Keeps the community safe",
                "emoji": {
                    "id": "1015248666807779329"
                }
            },
            "submit_channel_id": "YOUR_SUBMIT_CHANNEL_ID",
            "modal": modal("Moderator Application"),
            "submit_components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Promote to Mod",
                            "style": 3,
                            "logic": {
                                "DM_SUBMITTER": {
                                    "content": "Your **{FormTitle}** has been accepted!"
                                },
                                "DISABLE_ALL_COMPONENTS": false,
                                "REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW": true,
                                "UPDATE_COMPONENT": {
                                    "label": "Promoted to Mod"
                                },
                                "ADD_ROLE_TO_SUBMITTER": "YOUR_ROLE_ID"
                            }
                        },
                        {
                            "type": 2,
                            "label": "Deny",
                            "style": 4,
                            "logic": {
                                "DM_SUBMITTER_WITH_MODAL_INPUT": {
                                    "modal": {
                                        "title": "Deny Form",
                                        "components": [
                                            {
                                                "type": 1,
                                                "components": [
                                                    {
                                                        "type": 4,
                                                        "style": 2,
                                                        "label": "Reason for denial"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "message": {
                                        "content": "Sorry! Your **{FormTitle}** has been denied.",
                                        "embeds": [
                                            {
                                                "title": "Reason",
                                                "description": "{TextInputValue1}"
                                            }
                                        ]
                                    }
                                },
                                "DISABLE_ALL_COMPONENTS": false,
                                "REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW": true,
                                "UPDATE_COMPONENT": {
                                    "label": "Denied"
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            "select_menu_option": {
                "label": "Helper",
                "description": "Helps other community members",
                "emoji": {
                    "id": "1015248669399851048"
                }
            },
            "submit_channel_id": "YOUR_SUBMIT_CHANNEL_ID",
            "modal": modal("Helper Application"),
            "submit_components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Promote to Helper",
                            "style": 3,
                            "logic": {
                                "DM_SUBMITTER": {
                                    "content": "Your **{FormTitle}** has been accepted!"
                                },
                                "DISABLE_ALL_COMPONENTS": false,
                                "REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW": true,
                                "UPDATE_COMPONENT": {
                                    "label": "Promoted to Helper"
                                },
                                "ADD_ROLE_TO_SUBMITTER": "YOUR_ROLE_ID"
                            }
                        },
                        {
                            "type": 2,
                            "label": "Deny",
                            "style": 4,
                            "logic": {
                                "DM_SUBMITTER_WITH_MODAL_INPUT": {
                                    "modal": {
                                        "title": "Deny Form",
                                        "components": [
                                            {
                                                "type": 1,
                                                "components": [
                                                    {
                                                        "type": 4,
                                                        "style": 2,
                                                        "label": "Reason for denial"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "message": {
                                        "content": "Sorry! Your **{FormTitle}** has been denied.",
                                        "embeds": [
                                            {
                                                "title": "Reason",
                                                "description": "{TextInputValue1}"
                                            }
                                        ]
                                    }
                                },
                                "DISABLE_ALL_COMPONENTS": false,
                                "REMOVE_ALL_OTHER_COMPONENTS_IN_ACTION_ROW": true,
                                "UPDATE_COMPONENT": {
                                    "label": "Denied"
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
}