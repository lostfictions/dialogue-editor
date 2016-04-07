import React, { Component } from 'react';
// import { VelocityTransitionGroup } from 'velocity-react';
import ReactList from 'react-list';
import FastInput from '../Components/FastInput';

import { columnWidth, columnMargin } from '../Constants';

export default class Column extends Component {
  // This is a pretty hackish way of doing this, but it seemed simpler than
  // having the list view keep refs all the way down.
  componentDidUpdate = (prevProps) => {
    const itemId = this.props.focusedItem;
    if(itemId !== undefined && itemId !== prevProps.focusedItem) {
      this.refs.list.scrollTo(this.props.getIndexFromId(itemId));
      setTimeout(() => this.props.onFocus(undefined, this.props.title), 800);
    }
  }

  render() {
    const {
      itemGetter,
      sizeGetter,
      itemCount,
      style,
      title,
      onClickAdd,
      searchText,
      onSearch
    } = this.props;

    return (
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
            paddingLeft:7,
            verticalAlign:'middle',
            backgroundColor:'#111'
          }}>
            {title.toUpperCase()}
            <div style={{float:'right', marginRight:10, maxWidth:'60%', minWidth:'50%', textAlign: 'right'}}>
              {onSearch !== undefined
                ? <div style={{display:'inline-block', marginRight:10, width:'80%'}}>
                    <FastInput
                      type='text'
                      className='form-control input-sm'
                      placeholder={'Filter'}
                      onChange={function(e) { onSearch(e.target.value); }}
                      value={searchText !== undefined ? searchText : ''}
                    />
                    {searchText
                      ? <a
                          href='#'
                          //HACK: not the best way to position an inline clear button, but working fast for now!
                          style={{position:'absolute', right:41, top:2, fontSize:14}}
                          onClick={function(e) { e.preventDefault(); onSearch(''); }}>
                          <span className='text-muted glyphicon glyphicon-remove'></span>
                        </a>
                      : ''
                    }
                  </div>
                : ''
              }
              <a href={'#' + title + '-top'} //Scroll to the top of the column.
              onClick={function() { onClickAdd(); }}>
              <span className='glyphicon glyphicon-plus'></span>
              </a>
            </div>
          </header>
          <section style={{flexGrow:1, overflowY:'auto', height:'100%'}}>
            <div id={title + '-top'} />
            {/*<VelocityTransitionGroup enter={{animation: 'slideDown'}} leave={{animation: 'slideUp'}}>*/}
              <ReactList
                itemRenderer={itemGetter}
                length={itemCount}
                type='variable'
                itemSizeGetter={sizeGetter}
                ref='list'
               />
            {/*</VelocityTransitionGroup>*/}
          </section>
        </div>
      </div>
    );
  }
}
