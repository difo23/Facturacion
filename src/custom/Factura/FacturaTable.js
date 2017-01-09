import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import FormattedDatePicker from '../../lib/FormattedDatePicker'

const black54p = '#757575'
const noPaddingStyle = {padding: '0px'}
const renderTableHeader = () => {
  return (
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn width={40} style={noPaddingStyle}>#</TableHeaderColumn>
        <TableHeaderColumn width={80} style={noPaddingStyle}>Reg. Santario</TableHeaderColumn>
        <TableHeaderColumn width={170} style={noPaddingStyle}>Nombre</TableHeaderColumn>
        <TableHeaderColumn width={60} style={noPaddingStyle}>Lote</TableHeaderColumn>
        <TableHeaderColumn width={40} style={noPaddingStyle}>Cant.</TableHeaderColumn>
        <TableHeaderColumn width={70} style={noPaddingStyle}>Fecha Exp.</TableHeaderColumn>
        <TableHeaderColumn width={60} style={noPaddingStyle}>Precio</TableHeaderColumn>
        <TableHeaderColumn width={50} style={noPaddingStyle}>Importe</TableHeaderColumn>
        <TableHeaderColumn width={30} style={noPaddingStyle}></TableHeaderColumn>
      </TableRow>
    </TableHeader>
  )
}

export default class FacturaTable extends React.Component {

  static propTypes = {
    items: React.PropTypes.object.isRequired,
    onProductChanged: React.PropTypes.func.isRequired,
    onProductDeleted: React.PropTypes.func.isRequired,
  }

  renderRow = (product, i) => {
    const {
      onProductChanged,
      onProductDeleted,
    } = this.props
    const today = new Date()
    return (
    <TableRow key={i}>

      <TableRowColumn width={40} style={noPaddingStyle}>{i}</TableRowColumn>

      <TableRowColumn width={80} style={noPaddingStyle}>{product.get('codigo')}</TableRowColumn>

      <TableRowColumn width={170} style={noPaddingStyle}>{product.get('nombre')}</TableRowColumn>

      <TableRowColumn width={60} style={noPaddingStyle}>
        <TextField value={product.get('lote')} style={{width: '50px'}} name={"lote"}
          inputStyle={{textAlign: 'right', fontSize: '13px'}}
          onChange={(event) => { onProductChanged(i, 'lote', event.target.value) }}/>
      </TableRowColumn>

      <TableRowColumn width={40} style={noPaddingStyle}>
        <TextField style={{width: '28px'}} value={product.get('count')} name={"count"}
          inputStyle={{textAlign: 'right', fontSize: '13px'}}
          onChange={(event) => { onProductChanged(i, 'count', event.target.value) }}/>
          </TableRowColumn>

      <TableRowColumn width={70} style={noPaddingStyle}>
        <FormattedDatePicker value={product.get('fechaExp')} hintText={"expiración"}
        textFieldStyle={{width: '70px', fontSize: '13px'}} minDate={today}
          onChange={(event, date) => { onProductChanged(i, 'fechaExp', date) }}/>
      </TableRowColumn>

      <TableRowColumn width={60} style={noPaddingStyle}>
        $<TextField style={{width: '40px'}} name={'precio'} value={product.get('precioVenta')}
          onChange={(event) => { onProductChanged(i, 'precioVenta', event.target.value) }}
          inputStyle={{textAlign: 'right', fontSize: '13px'}}/>
      </TableRowColumn>

      <TableRowColumn width={50} style={{padding: '0px', textAlign: 'right', textOverflow: 'clip'}}>
        <a style={{marginRight: '34px'}}>
        $ {Number(product.get('precioVenta') * product.get('count')).toFixed(2)}
        </a>
      </TableRowColumn>

      <TableRowColumn width={30} style={{padding: '0px', textAlign: 'right'}} >
                <IconButton onTouchTap={() => onProductDeleted(i)}>
                  <Clear color={black54p}/>
                </IconButton>
      </TableRowColumn>

    </TableRow>
    )
  }

  render() {
    return (
    <Table height={'300px'} selectable={false}>
      { renderTableHeader() }
      <TableBody displayRowCheckbox={false}>
        { this.props.items.map(this.renderRow) }
      </TableBody>
    </Table>
    );
  }
}