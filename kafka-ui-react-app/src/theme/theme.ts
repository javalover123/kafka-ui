const Colors = {
  neutral: {
    '0': '#FFFFFF',
    '3': '#f9fafa',
    '4': '#f0f0f0',
    '5': '#F1F2F3',
    '10': '#E3E6E8',
    '15': '#D5DADD',
    '20': '#C7CED1',
    '25': '#C4C4C4',
    '30': '#ABB5BA',
    '40': '#8F9CA3',
    '50': '#73848C',
    '60': '#5C6970',
    '70': '#454F54',
    '75': '#394246',
    '80': '#2F3639',
    '85': '#22282A',
    '87': '#1E2224',
    '90': '#171A1C',
    '95': '#0B0D0E',
    '100': '#000',
  },
  transparency: {
    '10': 'rgba(10, 10, 10, 0.1)',
    '20': 'rgba(0, 0, 0, 0.1)',
    '50': 'rgba(34, 41, 47, 0.5)',
  },
  green: {
    '10': '#D6F5E0',
    '15': '#C2F0D1',
    '30': '#85E0A3',
    '40': '#5CD685',
    '60': '#29A352',
  },
  brand: {
    '5': '#E8E8FC',
    '10': '#D1D1FA',
    '15': '#B8BEF9',
    '20': '#A3A3F5',
    '30': '#7E7EF1',
    '50': '#4C4CFF',
    '60': '#1717CF',
    '70': '#1414B8',
  },
  red: {
    '10': '#FAD1D1',
    '20': '#F5A3A3',
    '50': '#E51A1A',
    '55': '#CF1717',
    '60': '#B81414',
  },
  yellow: {
    '10': '#FFEECC',
    '20': '#FFDD57',
  },
  blue: {
    '10': '#e3f2fd',
    '20': '#bbdefb',
    '30': '#90caf9',
    '40': '#64b5f6',
    '45': '#5865F2',
    '50': '#5B67E3',
    '60': '#7A7AB8',
    '70': '#5959A6',
    '80': '#3E3E74',
  },
};
export const theme = {
  link: {
    color: Colors.brand[50],
    hoverColor: Colors.brand[60],
  },
  hr: {
    backgroundColor: Colors.neutral[5],
  },
  code: {
    backgroundColor: Colors.neutral[5],
    color: Colors.red[55],
  },
  list: {
    label: {
      color: Colors.neutral[50],
    },
    // meta: {
    //   color: 'red',
    // },
  },
  progressBar: {
    backgroundColor: Colors.neutral[3],
    compleatedColor: Colors.green[40],
    borderColor: Colors.neutral[10],
  },
  layout: {
    backgroundColor: Colors.neutral[0],
    minWidth: '1200px',
    navBarWidth: '201px',
    navBarHeight: '53px',
    rightSidebarWidth: '70vw',
    filtersSidebarWidth: '300px',

    stuffColor: Colors.neutral[5],
    stuffBorderColor: Colors.neutral[10],
    overlay: {
      backgroundColor: Colors.neutral[50],
    },
    socialLink: {
      color: Colors.neutral[20],
    },
  },
  pageHeading: {
    height: '64px',
    dividerColor: Colors.neutral[30],
    backLink: {
      color: {
        normal: Colors.brand[70],
        hover: Colors.brand[60],
      },
    },
  },
  panelColor: {
    background: Colors.neutral[0],
    borderTop: 'none',
  },
  connectEditWarning: Colors.yellow[10],
  dropdown: {
    backgroundColor: Colors.neutral[0],
    borderColor: Colors.neutral[5],
    shadow: Colors.transparency[20],
    item: {
      color: {
        normal: Colors.neutral[90],
        danger: Colors.red[60],
      },
      backgroundColor: {
        default: Colors.neutral[0],
        hover: Colors.neutral[5],
      },
    },
  },
  ksqlDb: {
    query: {
      editor: {
        readonly: {
          background: Colors.neutral[3],
          selection: {
            backgroundColor: 'transparent',
          },
          cursor: {
            color: 'transparent',
          },
        },
        content: {
          backgroundColor: Colors.neutral[0],
          color: Colors.neutral[90],
        },
        activeLine: {
          backgroundColor: Colors.neutral[5],
        },
        cell: {
          backgroundColor: Colors.neutral[5],
        },
        layer: {
          backgroundColor: Colors.neutral[5],
          color: Colors.neutral[90],
        },
        cursor: Colors.neutral[90],
        variable: Colors.red[50],
        aceString: Colors.green[60],
      },
    },
    label: Colors.neutral[90],
  },
  heading: {
    h1: {
      color: Colors.neutral[90],
    },
    h3: {
      color: Colors.neutral[50],
      fontSize: '14px',
    },
    h4: Colors.neutral[90],
    base: {
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'normal',
      fontWeight: 500,
      color: Colors.neutral[100],
    },
    variants: {
      1: {
        fontSize: '20px',
        lineHeight: '32px',
      },
      2: {
        fontSize: '20px',
        lineHeight: '32px',
      },
      3: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 400,
        marginBottom: '16px',
      },
      4: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 500,
      },
      5: {
        fontSize: '12px',
        lineHeight: '16px',
      },
      6: {
        fontSize: '12px',
        lineHeight: '16px',
      },
    },
  },
  lastestVersionItem: {
    metaDataLabel: {
      color: Colors.neutral[50],
    },
  },
  alert: {
    color: {
      error: Colors.red[10],
      success: Colors.green[10],
      warning: Colors.yellow[10],
      info: Colors.neutral[10],
      loading: Colors.neutral[10],
      blank: Colors.neutral[10],
      custom: Colors.neutral[10],
    },
    shadow: Colors.transparency[20],
  },
  circularAlert: {
    color: {
      error: Colors.red[50],
      success: Colors.green[40],
      warning: Colors.yellow[10],
      info: Colors.neutral[10],
    },
  },
  button: {
    primary: {
      backgroundColor: {
        normal: Colors.brand[50],
        hover: Colors.brand[60],
        active: Colors.brand[70],
        disabled: Colors.neutral[5],
      },
      color: {
        normal: Colors.neutral[0],
        disabled: Colors.neutral[30],
      },
      invertedColors: {
        normal: Colors.brand[50],
        hover: Colors.brand[60],
        active: Colors.brand[60],
      },
    },
    secondary: {
      backgroundColor: {
        normal: Colors.brand[5],
        hover: Colors.brand[10],
        active: Colors.brand[30],
        disabled: Colors.neutral[5],
      },
      color: {
        normal: Colors.neutral[90],
        disabled: Colors.neutral[30],
      },
      isActiveColor: Colors.neutral[0],
      invertedColors: {
        normal: Colors.neutral[50],
        hover: Colors.neutral[70],
        active: Colors.neutral[90],
      },
    },
    danger: {
      backgroundColor: {
        normal: Colors.red[50],
        hover: Colors.red[55],
        active: Colors.red[60],
        disabled: Colors.red[20],
      },
      color: {
        normal: Colors.neutral[90],
        disabled: Colors.neutral[30],
      },
      invertedColors: {
        normal: Colors.brand[50],
        hover: Colors.brand[60],
        active: Colors.brand[60],
      },
    },
    height: {
      S: '24px',
      M: '32px',
      L: '40px',
    },
    fontSize: {
      S: '14px',
      M: '14px',
      L: '16px',
    },
    border: {
      normal: Colors.neutral[50],
      hover: Colors.neutral[70],
      active: Colors.neutral[90],
    },
  },
  chips: {
    backgroundColor: {
      normal: Colors.neutral[5],
      hover: Colors.neutral[10],
      active: Colors.neutral[50],
      hoverActive: Colors.neutral[60],
    },
    color: {
      normal: Colors.neutral[70],
      hover: Colors.neutral[70],
      active: Colors.neutral[0],
      hoverActive: Colors.neutral[0],
    },
  },
  menu: {
    backgroundColor: {
      normal: Colors.neutral[0],
      hover: Colors.neutral[3],
      active: Colors.neutral[5],
    },
    color: {
      normal: Colors.neutral[50],
      hover: Colors.neutral[70],
      active: Colors.brand[70],
      isOpen: Colors.neutral[90],
    },
    statusIconColor: {
      online: Colors.green[40],
      offline: Colors.red[50],
      initializing: Colors.yellow[20],
    },
    chevronIconColor: Colors.neutral[50],
    titleColor: Colors.neutral[90],
  },
  version: {
    currentVersion: {
      color: Colors.neutral[50],
    },
    symbolWrapper: {
      color: Colors.neutral[50],
    },
  },
  hyperlink: {
    color: Colors.neutral[90],
  },
  schema: {
    backgroundColor: {
      tr: Colors.neutral[5],
      div: Colors.neutral[0],
      p: Colors.neutral[80],
      textarea: Colors.neutral[3],
    },
  },
  modal: {
    color: Colors.neutral[80],
    backgroundColor: Colors.neutral[0],
    border: {
      top: Colors.neutral[5],
      bottom: Colors.neutral[5],
      contrast: Colors.neutral[30],
    },
    overlay: Colors.transparency[10],
    shadow: Colors.transparency[20],
    contentColor: Colors.neutral[70],
  },
  table: {
    actionBar: {
      backgroundColor: Colors.neutral[0],
    },
    th: {
      backgroundColor: {
        normal: Colors.neutral[0],
      },
      color: {
        sortable: Colors.neutral[30],
        normal: Colors.neutral[60],
        hover: Colors.brand[50],
        active: Colors.brand[50],
      },
      previewColor: {
        normal: Colors.brand[50],
      },
    },
    td: {
      borderTop: Colors.neutral[5],
      color: {
        normal: Colors.neutral[90],
      },
    },
    tr: {
      backgroundColor: {
        normal: Colors.neutral[0],
        hover: Colors.neutral[5],
      },
    },
    link: {
      color: {
        normal: Colors.neutral[90],
        hover: Colors.neutral[50],
        active: Colors.neutral[90],
      },
    },
    expander: {
      normal: Colors.brand[50],
      hover: Colors.brand[20],
      disabled: Colors.neutral[10],
    },
    pagination: {
      button: {
        background: Colors.neutral[90],
        border: Colors.neutral[80],
      },
      info: Colors.neutral[90],
    },
  },
  primaryTab: {
    height: '41px',
    color: {
      normal: Colors.neutral[50],
      hover: Colors.neutral[90],
      active: Colors.neutral[90],
    },
    borderColor: {
      normal: 'transparent',
      hover: 'transparent',
      active: Colors.brand[50],
      nav: Colors.neutral[10],
    },
  },
  secondaryTab: {
    backgroundColor: {
      normal: Colors.neutral[0],
      hover: Colors.neutral[5],
      active: Colors.neutral[10],
    },
    color: {
      normal: Colors.neutral[50],
      hover: Colors.neutral[90],
      active: Colors.neutral[90],
    },
  },
  select: {
    backgroundColor: {
      normal: Colors.neutral[0],
      hover: Colors.neutral[10],
      active: Colors.neutral[10],
    },
    color: {
      normal: Colors.neutral[90],
      hover: Colors.neutral[90],
      active: Colors.neutral[90],
      disabled: Colors.neutral[30],
    },
    borderColor: {
      normal: Colors.neutral[30],
      hover: Colors.neutral[50],
      active: Colors.neutral[70],
      disabled: Colors.neutral[10],
    },
    optionList: {
      scrollbar: {
        backgroundColor: Colors.neutral[30],
      },
    },
    label: Colors.neutral[50],
  },
  input: {
    borderColor: {
      normal: Colors.neutral[30],
      hover: Colors.neutral[50],
      focus: Colors.neutral[70],
      disabled: Colors.neutral[10],
    },
    color: {
      normal: Colors.neutral[90],
      placeholder: {
        normal: Colors.neutral[30],
        readOnly: Colors.neutral[30],
      },
      disabled: Colors.neutral[30],
      readOnly: Colors.neutral[90],
    },
    backgroundColor: {
      normal: Colors.neutral[0],
      readOnly: Colors.neutral[5],
      disabled: Colors.neutral[0],
    },
    error: Colors.red[50],
    icon: {
      color: Colors.neutral[70],
      hover: Colors.neutral[90],
    },
    label: {
      color: Colors.neutral[70],
    },
  },
  textArea: {
    borderColor: {
      normal: Colors.neutral[30],
      hover: Colors.neutral[50],
      focus: Colors.neutral[70],
      disabled: Colors.neutral[10],
    },
    color: {
      placeholder: {
        normal: Colors.neutral[30],
        focus: {
          normal: 'transparent',
          readOnly: Colors.neutral[30],
        },
      },
      disabled: Colors.neutral[30],
      readOnly: Colors.neutral[90],
    },
    backgroundColor: {
      readOnly: Colors.neutral[5],
    },
  },
  tag: {
    backgroundColor: {
      green: Colors.green[10],
      gray: Colors.neutral[5],
      yellow: Colors.yellow[10],
      white: Colors.neutral[10],
      red: Colors.red[10],
      blue: Colors.blue[10],
    },
    color: Colors.neutral[90],
  },
  switch: {
    unchecked: Colors.brand[20],
    checked: Colors.brand[50],
    circle: Colors.neutral[0],
    disabled: Colors.neutral[10],
    label: Colors.neutral[90],
    checkedIcon: {
      backgroundColor: Colors.neutral[70],
    },
  },
  pageLoader: {
    borderColor: Colors.brand[50],
    borderBottomColor: Colors.neutral[0],
  },
  metrics: {
    backgroundColor: Colors.neutral[5],
    sectionTitle: Colors.neutral[90],
    indicator: {
      backgroundColor: Colors.neutral[0],
      titleColor: Colors.neutral[50],
      warningTextColor: Colors.red[50],
      lightTextColor: Colors.neutral[30],
      color: Colors.neutral[90],
    },
    wrapper: Colors.neutral[0],
    filters: {
      color: {
        icon: Colors.neutral[90],
        normal: Colors.neutral[50],
      },
    },
  },
  scrollbar: {
    trackColor: {
      normal: Colors.neutral[0],
      active: Colors.neutral[5],
    },
    thumbColor: {
      normal: Colors.neutral[0],
      active: Colors.neutral[50],
    },
  },
  consumerTopicContent: {
    backgroundColor: Colors.neutral[0],
    td: {
      backgroundColor: Colors.neutral[5],
    },
  },
  topicFormLabel: {
    color: Colors.neutral[50],
  },
  topicMetaData: {
    backgroundColor: Colors.neutral[5],
    color: {
      label: Colors.neutral[50],
      value: Colors.neutral[80],
      meta: Colors.neutral[30],
    },
    liderReplica: {
      color: Colors.green[60],
    },
  },
  dangerZone: {
    borderColor: Colors.neutral[10],
    color: {
      title: Colors.red[50],
      warningMessage: Colors.neutral[50],
    },
  },
  configList: {
    color: Colors.neutral[30],
  },
  tooltip: {
    bg: Colors.neutral[70],
    text: Colors.neutral[0],
  },
  topicsList: {
    color: {
      normal: Colors.neutral[90],
      hover: Colors.neutral[50],
      active: Colors.neutral[90],
    },
    backgroundColor: {
      hover: Colors.neutral[5],
      active: Colors.neutral[10],
    },
  },
  icons: {
    moonIcon: Colors.neutral[30],
    sunIcon: Colors.neutral[30],
    infoIcon: 'none',
    closeIcon: Colors.neutral[30],
    deleteIcon: Colors.red[20],
    warningIcon: Colors.yellow[20],
    messageToggleIcon: {
      normal: Colors.brand[50],
      hover: Colors.brand[20],
      active: Colors.brand[60],
    },
    verticalElipsisIcon: Colors.neutral[50],
    liveIcon: {
      circleBig: Colors.red[10],
      circleSmall: Colors.red[50],
    },
    newFilterIcon: Colors.brand[50],
    closeModalIcon: Colors.neutral[25],
    savedIcon: Colors.brand[30], //--
    dropdownArrowIcon: Colors.neutral[30],
    git: {
      hover: Colors.neutral[50],
      active: Colors.neutral[90],
    },
    discord: {
      hover: Colors.brand[15],
      active: Colors.blue[45],
    },
  },
  viewer: {
    wrapper: {
      backgroundColor: Colors.neutral[3],
      color: Colors.neutral[80],
    },
  },
  savedFilter: {
    filterName: Colors.neutral[90],
    color: Colors.neutral[30],
    backgroundColor: Colors.neutral[5],
  },
  editFilterText: {
    color: Colors.brand[50],
  },
  statictics: {
    createdAtColor: Colors.neutral[50],
  },
};

export const darkTheme = {
  link: {
    color: Colors.brand[50], //--
    hoverColor: Colors.brand[30], //--
  },
  hr: {
    backgroundColor: Colors.neutral[80], //--
  },
  code: {
    backgroundColor: Colors.neutral[95], //--
    color: Colors.red[55], //--
  },
  list: {
    label: {
      color: Colors.neutral[50], //--
    },
    // meta: {
    //   color: Colors.neutral[30],
    // },
  },
  progressBar: {
    backgroundColor: Colors.neutral[3],
    compleatedColor: Colors.green[40],
    borderColor: Colors.neutral[10],
  },
  layout: {
    backgroundColor: Colors.neutral[90], //--
    minWidth: '1200px',
    navBarWidth: '201px',
    navBarHeight: '53px',
    rightSidebarWidth: '70vw',
    filtersSidebarWidth: '300px',
    stuffColor: Colors.neutral[75], //--
    stuffBorderColor: Colors.neutral[75], //--
    overlay: {
      backgroundColor: Colors.neutral[50],
    },
    socialLink: {
      color: Colors.neutral[30], //---
    },
  },
  pageHeading: {
    height: '64px',
    dividerColor: Colors.neutral[50], //--
    backLink: {
      color: {
        normal: Colors.brand[30], //--
        hover: Colors.brand[15], //--
      },
    },
  },
  panelColor: {
    background: Colors.neutral[90], //--
    borderTop: Colors.neutral[80], //--
  },
  connectEditWarning: Colors.yellow[10], //--
  dropdown: {
    backgroundColor: Colors.neutral[85], //
    borderColor: Colors.neutral[80], //--
    shadow: Colors.transparency[20], //--
    item: {
      color: {
        normal: Colors.neutral[0], //--
        danger: Colors.red[60], //--
      },
      backgroundColor: {
        default: Colors.neutral[85], //
        hover: Colors.neutral[80], //
      },
    },
  },
  ksqlDb: {
    query: {
      editor: {
        readonly: {
          background: Colors.neutral[3],
          selection: {
            backgroundColor: 'transparent',
          },
          cursor: {
            color: 'transparent',
          },
        },
        content: {
          backgroundColor: Colors.neutral[90], //--
          color: Colors.neutral[0], //--
        },
        activeLine: {
          backgroundColor: Colors.neutral[80], //--
        },
        cell: {
          backgroundColor: Colors.neutral[75], //--
        },
        layer: {
          backgroundColor: Colors.neutral[80], //--
          color: Colors.neutral[0], //--
        },
        cursor: Colors.neutral[0], //--
        variable: Colors.red[50],
        aceString: Colors.green[60],
      },
    },
    label: Colors.neutral[0], //--
  },
  heading: {
    h1: {
      color: Colors.neutral[90],
    },
    h3: {
      color: Colors.neutral[50],
      fontSize: '14px',
    },
    h4: Colors.neutral[0],
    base: {
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'normal',
      fontWeight: 500,
      color: Colors.neutral[0], //--
    },
    variants: {
      1: {
        fontSize: '20px',
        lineHeight: '32px',
      },
      2: {
        fontSize: '20px',
        lineHeight: '32px',
      },
      3: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 400,
        marginBottom: '16px',
      },
      4: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 500,
      },
      5: {
        fontSize: '12px',
        lineHeight: '16px',
      },
      6: {
        fontSize: '12px',
        lineHeight: '16px',
      },
    },
  },
  lastestVersionItem: {
    metaDataLabel: {
      color: Colors.neutral[50], //--
    },
  },
  alert: {
    color: {
      error: Colors.red[10],
      success: Colors.green[10],
      warning: Colors.yellow[10],
      info: Colors.neutral[10],
      loading: Colors.neutral[10],
      blank: Colors.neutral[10],
      custom: Colors.neutral[10],
    },
    shadow: Colors.transparency[20],
  },
  circularAlert: {
    color: {
      error: Colors.red[50],
      success: Colors.green[40],
      warning: Colors.yellow[10],
      info: Colors.neutral[10],
    },
  },
  button: {
    primary: {
      backgroundColor: {
        normal: Colors.brand[30], //--
        hover: Colors.brand[20], //--
        active: Colors.brand[10], //--
        disabled: Colors.neutral[75], //--
      },
      color: {
        normal: Colors.neutral[0], //--
        disabled: Colors.neutral[60], //--
      },
      invertedColors: {
        normal: Colors.brand[30], //--
        hover: Colors.brand[60],
        active: Colors.brand[60],
      },
    },
    secondary: {
      backgroundColor: {
        normal: Colors.blue[80], //--
        hover: Colors.blue[70], //--
        active: Colors.blue[60], //--
        disabled: Colors.neutral[75], //--
      },
      color: {
        normal: Colors.neutral[0], //--
        disabled: Colors.neutral[60], //--
      },
      isActiveColor: Colors.neutral[90],
      invertedColors: {
        normal: Colors.neutral[50],
        hover: Colors.neutral[70],
        active: Colors.neutral[90],
        disabled: Colors.neutral[75], //--
      },
    },
    danger: {
      backgroundColor: {
        normal: Colors.red[50], //--
        hover: Colors.red[55], //--
        active: Colors.red[60], //--
        disabled: Colors.red[20], //--
      },
      color: {
        normal: Colors.neutral[90],
        disabled: Colors.neutral[30],
      },
      invertedColors: {
        normal: Colors.brand[50],
        hover: Colors.brand[60],
        active: Colors.brand[60],
      },
    },
    height: {
      S: '24px',
      M: '32px',
      L: '40px',
    },
    fontSize: {
      S: '14px',
      M: '14px',
      L: '16px',
    },
    border: {
      normal: Colors.neutral[50],
      hover: Colors.neutral[70],
      active: Colors.neutral[90],
    },
  },
  chips: {
    backgroundColor: {
      normal: Colors.neutral[80],
      hover: Colors.neutral[70],
      active: Colors.neutral[50],
      hoverActive: Colors.neutral[40],
    },
    color: {
      normal: Colors.neutral[0],
      hover: Colors.neutral[0],
      active: Colors.neutral[90],
      hoverActive: Colors.neutral[90],
    },
  },
  menu: {
    backgroundColor: {
      normal: Colors.neutral[90], //--
      hover: Colors.neutral[87], //--
      active: Colors.neutral[85], //--
    },
    color: {
      normal: Colors.neutral[40], //--
      hover: Colors.neutral[20], //--
      active: Colors.brand[20], //--
      isOpen: Colors.neutral[90],
    },
    statusIconColor: {
      online: Colors.green[40],
      offline: Colors.red[50],
      initializing: Colors.yellow[20],
    },
    chevronIconColor: Colors.neutral[50],
    titleColor: Colors.neutral[0],
  },
  hyperlink: {
    color: Colors.neutral[0],
  },
  version: {
    currentVersion: {
      color: Colors.neutral[50],
    },
    symbolWrapper: {
      color: Colors.neutral[50],
    },
  },
  schema: {
    backgroundColor: {
      tr: Colors.neutral[5],
      div: Colors.neutral[0],
      p: Colors.neutral[0], //--
      textarea: Colors.neutral[85],
    },
  },
  modal: {
    color: Colors.neutral[0], //--
    backgroundColor: Colors.neutral[85], //--
    border: {
      top: Colors.neutral[75], //--
      bottom: Colors.neutral[75], //--
      contrast: Colors.neutral[75], //--
    },
    overlay: Colors.transparency[10],
    shadow: Colors.transparency[20],
    contentColor: Colors.neutral[30],
  },
  table: {
    actionBar: {
      backgroundColor: Colors.neutral[90],
    },
    th: {
      backgroundColor: {
        normal: Colors.neutral[90],
      },
      color: {
        sortable: Colors.neutral[30],
        normal: Colors.neutral[60],
        hover: Colors.brand[50],
        active: Colors.brand[50],
      },
      previewColor: {
        normal: Colors.brand[50],
      },
    },
    td: {
      borderTop: Colors.neutral[80],
      color: {
        normal: Colors.neutral[0],
      },
    },
    tr: {
      backgroundColor: {
        normal: Colors.neutral[90],
        hover: Colors.neutral[85],
      },
    },
    link: {
      color: {
        normal: Colors.neutral[0], //--
        hover: Colors.neutral[0],
        active: Colors.neutral[0],
      },
    },
    expander: {
      normal: Colors.brand[50],
      hover: Colors.brand[20],
      disabled: Colors.neutral[10],
    },
    pagination: {
      button: {
        background: Colors.neutral[90],
        border: Colors.neutral[80],
      },
      info: Colors.neutral[0],
    },
  },
  primaryTab: {
    height: '41px',
    color: {
      normal: Colors.neutral[50], //--
      hover: Colors.neutral[0], //--
      active: Colors.brand[30], //--
    },
    borderColor: {
      normal: 'transparent',
      hover: 'transparent',
      active: Colors.brand[50],
      nav: Colors.neutral[10],
    },
  },
  secondaryTab: {
    backgroundColor: {
      normal: Colors.neutral[90], //--
      hover: Colors.neutral[85], //--
      active: Colors.neutral[80], //--
    },
    color: {
      normal: Colors.neutral[50], //--
      hover: Colors.neutral[0], //--
      active: Colors.neutral[0], //--
    },
  },
  select: {
    backgroundColor: {
      normal: Colors.neutral[85], //--
      hover: Colors.neutral[80], //--
      active: Colors.neutral[70], //--
    },
    color: {
      normal: Colors.neutral[0], //--
      hover: Colors.neutral[0], //--
      active: Colors.neutral[0], //--
      disabled: Colors.neutral[60], //--
    },
    borderColor: {
      normal: Colors.neutral[70],
      hover: Colors.neutral[50],
      active: Colors.neutral[70],
      disabled: Colors.neutral[70],
    },
    optionList: {
      scrollbar: {
        backgroundColor: Colors.neutral[30],
      },
    },
    label: Colors.neutral[50],
  },
  input: {
    borderColor: {
      normal: Colors.neutral[70],
      hover: Colors.neutral[50],
      focus: Colors.neutral[0],
      disabled: Colors.neutral[80],
    },
    color: {
      normal: Colors.neutral[0],
      placeholder: {
        normal: Colors.neutral[60], //--
        readOnly: Colors.neutral[0],
      },
      disabled: Colors.neutral[80],
      readOnly: Colors.neutral[0],
    },
    backgroundColor: {
      normal: Colors.neutral[90],
      readOnly: Colors.neutral[80],
      disabled: Colors.neutral[90],
    },
    error: Colors.red[50],
    icon: {
      color: Colors.neutral[30],
      hover: Colors.neutral[0],
    },
    label: {
      color: Colors.neutral[30], //--
    },
  },
  textArea: {
    borderColor: {
      normal: Colors.neutral[30],
      hover: Colors.neutral[50],
      focus: Colors.neutral[70],
      disabled: Colors.neutral[10],
    },
    color: {
      placeholder: {
        normal: Colors.neutral[30],
        focus: {
          normal: 'transparent',
          readOnly: Colors.neutral[30],
        },
      },
      disabled: Colors.neutral[30],
      readOnly: Colors.neutral[90],
    },
    backgroundColor: {
      readOnly: Colors.neutral[5],
    },
  },
  tag: {
    backgroundColor: {
      green: Colors.green[10],
      gray: Colors.neutral[5],
      yellow: Colors.yellow[10],
      white: Colors.neutral[10],
      red: Colors.red[10],
      blue: Colors.blue[10],
    },
    color: Colors.neutral[90],
  },
  switch: {
    unchecked: Colors.brand[20],
    checked: Colors.brand[50],
    circle: Colors.neutral[0],
    disabled: Colors.neutral[10],
    label: Colors.neutral[0],
    checkedIcon: {
      backgroundColor: Colors.neutral[70],
      width: '40px',
    },
  },
  pageLoader: {
    borderColor: Colors.brand[50],
    borderBottomColor: Colors.neutral[0],
  },
  metrics: {
    backgroundColor: Colors.neutral[95], //---
    sectionTitle: Colors.neutral[0], //--
    indicator: {
      backgroundColor: Colors.neutral[90], //---
      titleColor: Colors.neutral[0], // ---
      warningTextColor: Colors.red[50],
      lightTextColor: Colors.neutral[60], //--
      color: Colors.neutral[0], //--
    },
    wrapper: Colors.neutral[0],
    filters: {
      color: {
        icon: Colors.neutral[0],
        normal: Colors.neutral[50],
      },
    },
  },
  scrollbar: {
    trackColor: {
      normal: Colors.neutral[90], //--
      active: Colors.neutral[85], //--
    },
    thumbColor: {
      normal: Colors.neutral[75], //--
      active: Colors.neutral[50],
    },
  },
  consumerTopicContent: {
    backgroundColor: Colors.neutral[90], //--
    td: {
      backgroundColor: Colors.neutral[95], //--
    },
  },
  topicFormLabel: {
    color: Colors.neutral[50],
  },
  topicMetaData: {
    backgroundColor: Colors.neutral[90], //--
    color: {
      label: Colors.neutral[50], //--
      value: Colors.neutral[0], //--
      meta: Colors.neutral[60], //--
    },
    liderReplica: {
      color: Colors.green[60],
    },
  },
  dangerZone: {
    borderColor: Colors.neutral[10],
    color: {
      title: Colors.red[50],
      warningMessage: Colors.neutral[50],
    },
  },
  configList: {
    color: Colors.neutral[30],
  },
  tooltip: {
    bg: Colors.neutral[70],
    text: Colors.neutral[0],
  },
  topicsList: {
    color: {
      normal: Colors.neutral[90],
      hover: Colors.neutral[50],
      active: Colors.neutral[90],
    },
    backgroundColor: {
      hover: Colors.neutral[5],
      active: Colors.neutral[10],
    },
  },
  icons: {
    moonIcon: Colors.neutral[30],
    sunIcon: Colors.neutral[30],
    infoIcon: Colors.neutral[0],
    closeIcon: Colors.neutral[30],
    deleteIcon: Colors.red[20],
    warningIcon: Colors.yellow[20],
    messageToggleIcon: {
      normal: Colors.brand[50],
      hover: Colors.brand[20],
      active: Colors.brand[60],
    },
    verticalElipsisIcon: Colors.neutral[50],
    liveIcon: {
      circleBig: Colors.red[10],
      circleSmall: Colors.red[50],
    },
    newFilterIcon: Colors.brand[50],
    closeModalIcon: Colors.neutral[25],
    savedIcon: Colors.brand[50],
    dropdownArrowIcon: Colors.neutral[30],
    git: {
      hover: Colors.neutral[70],
      active: Colors.neutral[90],
    },
    discord: {
      hover: Colors.brand[15],
      active: Colors.blue[45],
    },
  },
  viewer: {
    wrapper: {
      backgroundColor: Colors.neutral[85],
      color: Colors.neutral[0],
    },
  },
  savedFilter: {
    filterName: Colors.neutral[0],
    color: Colors.neutral[70],
    backgroundColor: Colors.neutral[80],
  },
  editFilterText: {
    color: Colors.brand[30],
  },
  statictics: {
    createdAtColor: Colors.neutral[50],
  },
};

export type ThemeType = typeof theme;
