import React from 'react';
// import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import "./CommentCard.css"
export default function CommentCard(props) {

  const {name, time, comment} = props;
  return (
    <Card className='commentCard'>
        <div className="topRow">
          <b>{name}</b>
          {time}
        </div>
        <div className='commentRow'>
          {comment}
        </div>
    </Card>
  );
}