"use client";

import { useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Edit2, Facebook, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SocialLink = {
  id: string;
  name: string;
};

export default function Component() {
  const [links, setLinks] = useState<SocialLink[]>([
    { id: "1", name: "Facebook" },
    { id: "2", name: "Facebook" },
    { id: "3", name: "Facebook" },
    { id: "4", name: "Facebook" },
    { id: "5", name: "Facebook" },
    { id: "6", name: "Facebook" },
  ]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newLinks = Array.from(links);
    const [reorderedItem] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedItem);

    setLinks(newLinks);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleAddLink = () => {
    const newId = (links.length + 1).toString();
    setLinks([...links, { id: newId, name: "Facebook" }]);
  };

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                    >
                      <Card>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-2">
                            <Facebook className="h-5 w-5 text-blue-600" />
                            <span>{link.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(link.id)}
                              aria-label="Delete link"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              {...provided.dragHandleProps}
                              aria-label="Drag to reorder"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        onClick={handleAddLink}
        className="mt-4 w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        + Add Link
      </Button>
    </div>
  );
}
