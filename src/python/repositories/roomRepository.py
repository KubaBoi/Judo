#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository rooms
#@dbscheme (id, hotel_id, bed, count, price_RO, price_BB, price_HB, price_FB)
#@dbmodel Room
class RoomRepository(CheeseRepository):

    #@query "select * from rooms where hotel_id=:hotelId;"
    #@return array
    @staticmethod
    def findRoomsByHotelId(hotelId):
        return CheeseRepository.findRoomsByHotelId([hotelId])

    #@query "select max(id) from rooms;"
    #@return num
    @staticmethod
    def findNewId():
        try:
            return CheeseRepository.findNewId([])+1
        except:
            return 0

    @staticmethod
    def save(obj):
        return CheeseRepository.save([obj])

    @staticmethod
    def update(obj):
        return CheeseRepository.update([obj])

    @staticmethod
    def delete(obj):
        return CheeseRepository.delete([obj])
