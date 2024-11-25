package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"reflect"
)

func BodyParser[T any](body io.ReadCloser) (T, error) {
	var res T
	if err := json.NewDecoder(body).Decode(&res); err != nil {
		return res, err
	}
	v := reflect.ValueOf(res)
	for i := 0; i < v.NumField(); i++ {
		fieldValue := v.Field(i)
		fieldName := v.Type().Field(i).Name
		// Check if the field is not empty
		if fieldValue.Kind() == reflect.String {
			if fieldValue.String() == "" {
				return res, fmt.Errorf("%s is required.", fieldName)
			}
		}
	}
	return res, nil
}
