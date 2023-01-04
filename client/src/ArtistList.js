import { useState, memo } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initial = Array.from({ length: 0 }, (v, k) => k).map(k => {
	const custom = {
	  id: `id-${k}`,
	  content: `Artist ${k}`
	};
  
	return custom;
  });
  
  const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
  
	return result;
  };

function Artist({ artist, index }) {
	return (
	  <Draggable draggableId={artist.id} index={index}>
		{provided => (
		  <div class="artistDiv"
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
		  >
			{artist.content}
		  </div>
		)}
	  </Draggable>
	);
  }
  
  const Artists = memo(function Artists({ artists }) {
	return artists.map((artist, index) => (
	  <Artist artist={artist} index={index} key={artist.id} />
	));
  });


export default function ArtistList() {
	const [state, setState] = useState({ artists: initial });

	function onDragEnd(result) {
	  if (!result.destination) {
		return;
	  }
  
	  if (result.destination.index === result.source.index) {
		return;
	  }
  
	  const artists = reorder(
		state.artists,
		result.source.index,
		result.destination.index
	  );
  
	  setState({ artists });
	}

	return <DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="list">
				{provided => (
				<div id="selectedArtistListDiv" ref={provided.innerRef} {...provided.droppableProps}>
					<Artists artists={state.artists} />
					{provided.placeholder}
				</div>
				)}
			</Droppable>
		</DragDropContext>
}