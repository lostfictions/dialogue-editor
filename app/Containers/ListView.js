import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import ReactList from 'react-list';

//TODO: allow setting column width manually
const columnWidth = 500;
const columnMargin = 5;

export const ColumnsContainer = ({ children }) => (
  <div style={{
    position:'relative',
    display:'block',
    height:'100%',
    width:'100%',
    overflowX:'auto',
    overflowY:'hidden'}}>
    <div style={{
      width:React.Children.count(children) * (columnWidth + columnMargin),
      height:'100%'
    }}>
      {children}
    </div>
  </div>
);

export const Column = ({itemGetter, sizeGetter, itemCount, style, title, onClickAdd }) => (
  <div style={{
    position:'relative',
    display:'block',
    height:'calc(100% - 1px)',
    float:'left',
    minWidth:320,
    width:columnWidth,
    marginLeft:columnMargin,
    ...style
  }}>
    <div style={{
      position:'absolute',
      top:0,
      bottom:0,
      width:'100%',
      borderLeft:'1px solid #000',
      borderRight:'1px solid #000',
      boxSizig:'border-box',
      display:'flex',
      flexDirection:'column'
    }}>
      <header style={{
        margin:'auto',
        width:'100%',
        height:50,
        lineHeight:'50px',
        flexShrink:0,
        textAlign:'center',
        verticalAlign:'middle',
        backgroundColor:'#111'
      }}>
        {title}
        <a href={'#' + title + '-top'} //Scroll to the top of the column.
           style={{float:'right', marginRight:10}}
           onClick={() => { onClickAdd(); }}>
          <span className='glyphicon glyphicon-plus'></span>
        </a>
      </header>
      <section style={{flexGrow:1, overflowY:'auto', height:'100%'}}>
        <div id={title + '-top'} />
        {/*<VelocityTransitionGroup enter={{animation: 'slideDown'}} leave={{animation: 'slideUp'}}>*/}
          <ReactList
            itemRenderer={itemGetter}
            length={itemCount}
            type='variable'
            itemSizeGetter={sizeGetter}
           />
        {/*</VelocityTransitionGroup>*/}
      </section>
    </div>
  </div>
);
