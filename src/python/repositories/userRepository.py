#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository users
#@dbscheme (id, account_name, user_name)
#@dbmodel User
class UserRepository(CheeseRepository):

    #@query "select u.id, u.account_name, u.user_name from passwords p
    #        inner join users u
    #        on u.id = p.user_id
    #        where p.password = :password and u.user_name = :userName;"
    #@return one
    @staticmethod
    def findUserByCredentials(userName, password):
        return CheeseRepository.findUserByCredentials([userName, password])

    @staticmethod
    def save(obj):
        return CheeseRepository.save([obj])

    @staticmethod
    def update(obj):
        return CheeseRepository.update([obj])

    @staticmethod
    def delete(obj):
        return CheeseRepository.delete([obj])
