#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository tokens
#@dbscheme (id, token, user_id, ip)
#@dbmodel Token
class TokenRepository(CheeseRepository):

    #@query "select t.id, t.token, t.user_id, t.ip from tokens t
    #        inner join users u
    #        on u.id = t.user_id
    #        where t.ip = :ip and t.user_id = :userId;"
    #@return one
    @staticmethod
    def findTokenByUserIdAndIp(userId, ip):
        return CheeseRepository.findTokenByUserIdAndIp([userId, ip])

    #@query "select max(id) from tokens;"
    #@return num
    @staticmethod
    def findNewId():
        try:
            return CheeseRepository.findNewId([])+1
        except:
            return 0

    #@query "select case when exists
    #        (select * from tokens t where t.token = :userName)
    #        then cast(0 as bit)
    #        else cast(1 as bit) end;"
    #@return bool
    @staticmethod
    def validateToken(token):
        return CheeseRepository.validateToken([token])

    @staticmethod
    def save(obj):
        return CheeseRepository.save([obj])

    @staticmethod
    def update(obj):
        return CheeseRepository.update([obj])

    @staticmethod
    def delete(obj):
        return CheeseRepository.delete([obj])
