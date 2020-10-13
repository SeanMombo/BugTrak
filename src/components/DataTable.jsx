import React from 'react';

import PropTypes from 'prop-types';

import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { truncateString } from '../utils'
import { Delete as DeleteForever, Edit, DescriptionIcon} from '@material-ui/icons'

import { useFirestore } from 'react-redux-firebase'
import { useHistory } from "react-router-dom";
import { AddAPhotoOutlined } from '@material-ui/icons';
// import { PlayCircleFilledWhite } from '@material-ui/icons';

import ConfirmationDialogue from './ConfirmationDialog'

function descendingComparator(a, b, orderBy) {
  let aa = a[orderBy];
  let bb = b[orderBy];

  if (typeof a[orderBy] === 'string') aa = a[orderBy].toLowerCase();
  if (typeof b[orderBy] === 'string') bb = b[orderBy].toLowerCase();

  if (bb < aa) {
    return -1;
  }
  if (bb > aa) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding='default'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            
           {headCell.id !== 'action' ?
            <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <b>{headCell.label}</b>
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel> : null
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

//////////// TOOLBAR HEAD //////////////////////////////
const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),

    backgroundColor: '#303030',
    color:'white',
    display:'flex',
    flexDirection:'row',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  textField: {
    backgroundColor:'white',
    color:'black',
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { tableTitle } = props;

  return (
    <Toolbar
      className={classes.root}
      variant="dense"
      component={Paper}
      square
    >
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        
        {tableTitle}
       
      </Typography>
      
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


///////////////////////////////////////////////
const useStyles = makeStyles((theme) => ({
  root: {
    // width: '100%',
    margin:8,
    
  },
  headerBottom: {
    marginBottom: '1px solid black'
  },
  paper: {
    width: '100%',
    // marginBottom: theme.spacing(2),
  },
  table: {
    height:'100%',
    minWidth: 500,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  button: {
    minWidth: 50,
  },
  buttonGroup: {
   
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-end',

  },
  deleteButton: {
    minWidth: 54,
    cursor:'pointer',
    marginLeft:16
  },
  searchRoot: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },

}));


export default function EnhancedTable({data, altData, tableProps, isLoading}) {

  let headCells, linkRoute, tableTitle, buttonName;

  headCells = tableProps.headers;
  tableTitle = tableProps.tableTitle;
  linkRoute = tableProps.linkRoute;
  buttonName = tableProps.buttonName;

  const classes = useStyles();
  let history = useHistory();
  const firestore = useFirestore();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  ///////////////////////////
  function createRows(data) {
    let rows = [];
    const dateStrings = ['dateEdited', 'dateCreated'];
    const userIdStrings = ['submitter', 'creator', 'assignee', 'userId'];
    data.forEach(obj => {
      let o = {...obj};

      Object.keys(o).forEach(key => {

        if (dateStrings.includes(key)) {
          let t;
          t = new Date(o[key].seconds * 1000 + o[key].nanoseconds/1000000);
          t = t.toISOString().split('T')[0];
          o[key] = t;
        } else if (userIdStrings.includes(key) && o[key]) { 
          o[key] = o[key].displayName;
        }

        return o[key]
      })

      rows.push({...o});
    })
  
    return rows;
  }

  const [rows, setRows] = React.useState(createRows(data));
  const [searchRows, setSearchRows] = React.useState(createRows(data));
  const [search, setSearch] = React.useState('');

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
    setSearchRows(searchData(rows, event.target.value))
  };


  /////////////////////////

  /////////////////////////



  /////////////////////////////

  const searchData = (rows, str) => {
    const rejectedCols = [ 'projectId', 'userId', 'action'];

    str = str.toLowerCase();
    let columns = rows[0] && Object.keys(rows[0]);
    console.log(columns)
    columns = Object.values(headCells).map(val => val.id)
    console.log(columns)

    columns = columns.filter(el => !rejectedCols.includes(el))
    return rows.filter(row => 
      columns.some(
        col => { 
          return row[col].toString().toLowerCase().indexOf(str) > -1 }))
    
  }

  ///////////////////////////
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 
  const handleManageProjectClick = (event) => {
    // console.log(event.currentTarget.value)
    history.push(linkRoute + `${event.currentTarget.value}`);
  }

  const handleDeleteClick = (event) => {
    firestore.delete(`projects/${event.currentTarget.value}`)
  }

  // const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const DisplayRow = ({row, buttonName}) => {
    return (
      <TableRow
        hover
        key={row.title}
      >

        {headCells.map(head => {
          
          let stringVal = truncateString(row[head.id], 100);
           return (head.id !== 'action') ? 
            <TableCell align="left" >{stringVal}</TableCell> 
            : tableTitle==='Projects' ?
              <TableCell align="right">
                <div className={classes.buttonGroup} align="right">
                  <Button  
                    variant="contained" color="primary" size="small" 
                    className={classes.button}
                    value={row.id}
                    onClick={handleManageProjectClick}
                    startIcon={<Edit />}
                    >
                    Edit
                  </Button>
                  <ConfirmationDialogue id={`${linkRoute}${row.id}`}/>
                </div>
              </TableCell>
              : 
              <TableCell align="right">
                <Button  
                  variant="contained" color="primary" size="small" 
                  className={classes.button}
                  value={row.id}
                  onClick={handleManageProjectClick}
                  >
                  {buttonName}
                </Button>

                
              </TableCell>

        })}
        
    
      </TableRow>
    )
  }




  return (
    <div className={classes.root}>
       
      <Paper className={classes.paper} elevation={3}>
        
        <EnhancedTableToolbar numSelected={selected.length} tableTitle={tableTitle} altData={altData} elevation={3} />
        <TextField
          // label="Dense"
          id={`filled-margin-dense_${tableTitle}`}
          // defaultValue="Default Value"
          className={classes.textField}
          // helperText="Some important text"
          placeholder="Seach any field value"
          margin="dense"
          value={search}
          onChange={handleChangeSearch}
        />

        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              className={classes.headerBottom}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
   
            <TableBody>
              {stableSort(searchRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {

                  return (
                    <DisplayRow row={row} buttonName={buttonName}/>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}