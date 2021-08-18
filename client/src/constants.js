export const CURRENT_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3000/";
export const CURRENT_SERVER_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3001/";

export const errorStr = `Please try refreshing the page - your session may have timed out. If the problem persists, please contact the developer.`;


export const sortOptions = [
    {
      key: 'popularity',
      text: 'Popularity',
      value: 'popularity',
    },
    {
        key: 'chronology',
        text: 'Chronology',
        value: 'release_date',
      },

]

export const defaultFilterOptions = [
    {label: 'remix', value: 'remix'},
    {label: 'commentary', value: 'commentary'},
    {label: 'karaoke', value: 'karaoke'},
    {label: 'instrumental', value: 'instrumental'},
    {label: 'acoustic', value: 'acoustic'},
    {label: 'voice memo', value: 'voice memo'},
];